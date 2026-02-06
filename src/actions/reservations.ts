'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export type ReservationState = {
    success: boolean;
    message: string;
    errors?: Record<string, string>;
};

export async function submitReservation(prevState: any, formData: FormData): Promise<ReservationState> {
    // supabase is already initialized


    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const partySize = parseInt(formData.get('partySize') as string);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    // Basic Validation
    if (!date || !time || !partySize || !name || !email || !phone) {
        return { success: false, message: 'Todos los campos son obligatorios.' };
    }

    // Check Availability Logic
    const requestedDate = new Date(`${date}T${time}`);

    // Define duration (e.g., 2 hours)
    const DURATION_MS = 2 * 60 * 60 * 1000;
    const requestedEnd = new Date(requestedDate.getTime() + DURATION_MS);

    // 1. Get all active tables that fit the party size
    const { data: eligibleTables, error: tablesError } = await supabase
        .from('restaurant_tables')
        .select('id, capacity')
        .eq('is_active', true)
        .gte('capacity', partySize)
        .order('capacity', { ascending: true }); // Try smallest fit first

    if (tablesError || !eligibleTables || eligibleTables.length === 0) {
        // If no tables defined, fallback to allowing reservation (legacy behavior) or block?
        // Let's block if tables exist but none fit. If table inventory is empty, maybe allow?
        // Safety: If no tables in DB, we assume "No Availability" or "Open System"? 
        // User asked for "manual tables", so we presume they will add them.

        // If NO tables exist at all, we might warn used.
        // For now, let's assume if no tables fit, we return error.
        return { success: false, message: 'Lo sentimos, no hay mesas disponibles para ese número de personas.' };
    }

    // 2. Check reservations that overlap with this time slot
    // Overlap: (StartA < EndB) and (EndA > StartB)
    const { data: conflictingReservations, error: conflictError } = await supabase
        .from('reservations')
        .select('table_id, date, time')
        .eq('date', date) // Optimization: only check same day
        .neq('status', 'cancelled')
        .not('table_id', 'is', null);

    if (conflictError) {
        console.error('Availability check error:', conflictError);
        return { success: false, message: 'Error al verificar disponibilidad.' };
    }

    // Filter conflicts by time overlap
    // Note: We need to know the duration of existing reservations. Assuming 2 hours for all for simplicity now.
    const busyTableIds = new Set<string>();

    if (conflictingReservations) {
        for (const res of conflictingReservations) {
            const resStart = new Date(`${res.date}T${res.time}`);
            const resEnd = new Date(resStart.getTime() + DURATION_MS);

            if (requestedDate < resEnd && requestedEnd > resStart) {
                if (res.table_id) busyTableIds.add(res.table_id);
            }
        }
    }

    // 3. Find first available table
    const availableTable = eligibleTables.find(t => !busyTableIds.has(t.id));

    if (!availableTable) {
        return { success: false, message: 'Lo sentimos, no hay mesas disponibles a esa hora.' };
    }

    // Insert into DB with assigned table_id
    const { error } = await supabase.from('reservations').insert({
        date,
        time,
        party_size: partySize,
        name,
        email,
        phone,
        status: 'confirmed',
        table_id: availableTable.id
    });

    if (error) {
        console.error('Reservation Error:', error);
        return { success: false, message: 'Hubo un error al procesar tu reserva. Inténtalo de nuevo.' };
    }

    revalidatePath('/admin/bookings');
    return { success: true, message: '¡Reserva confirmada correctamente!' };
}

export async function getReservations(startDate: string, endDate: string) {
    // supabase is already initialized

    // Sort by date (descending) and then time (descending) so newest are first
    const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

    if (error) {
        console.error('Fetch Booking Error:', error);
        return [];
    }
    return data;
}

export async function getRecentReservations(limit: number = 5) {
    const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Fetch Recent Error:', error);
        return [];
    }
    return data;
}

export async function getTodaysReservations() {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .gte('date', start)
        .lte('date', end)
        .order('time', { ascending: true });

    if (error) {
        console.error('Fetch Today Error:', error);
        return [];
    }
    return data;
}
