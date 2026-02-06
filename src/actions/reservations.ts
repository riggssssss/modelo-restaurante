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

    // 0. Fetch System Settings
    const { data: contentData } = await supabase
        .from('site_content')
        .select('*')
        .in('key', ['res_mode', 'res_max_capacity', 'res_auto_confirm']);

    const settings: Record<string, string> = {};
    contentData?.forEach(item => {
        if (item.value && typeof item.value === 'object' && item.value.text) {
            settings[item.key] = item.value.text;
        }
    });

    const mode = settings['res_mode'] || 'tables'; // Default to tables
    const maxCapacity = parseInt(settings['res_max_capacity'] || '50');
    const autoConfirm = settings['res_auto_confirm'] === 'true';

    // Global Validation: Reject parties larger than feasible?
    // In tables mode, this is handled by "no table fits".
    // In capacity mode, we might just check if partySize > maxCapacity (unlikely but possible).

    const requestedDate = new Date(`${date}T${time}`);
    const DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
    const requestedEnd = new Date(requestedDate.getTime() + DURATION_MS);

    let assignedTableId = null;
    let reservationStatus = 'pending';

    if (mode === 'tables') {
        // --- TABLE MANAGEMENT MODE ---

        // 1. Get all active tables that fit the party size
        const { data: eligibleTables, error: tablesError } = await supabase
            .from('restaurant_tables')
            .select('id, capacity')
            .eq('is_active', true)
            .gte('capacity', partySize)
            .order('capacity', { ascending: true });

        if (tablesError || !eligibleTables || eligibleTables.length === 0) {
            return { success: false, message: 'Lo sentimos, no tenemos mesas con capacidad para ese número de personas.' };
        }

        // 2. Check reservations that overlap
        const { data: conflictingReservations, error: conflictError } = await supabase
            .from('reservations')
            .select('table_id, date, time')
            .eq('date', date)
            .neq('status', 'cancelled')
            .not('table_id', 'is', null);

        if (conflictError) {
            return { success: false, message: 'Error al verificar disponibilidad.' };
        }

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

        assignedTableId = availableTable.id;

    } else {
        // --- TOTAL CAPACITY MODE ---

        // 1. Calculate current covers for this slot
        const { data: activeReservations, error: capacityError } = await supabase
            .from('reservations')
            .select('party_size, date, time')
            .eq('date', date)
            .neq('status', 'cancelled');

        if (capacityError) {
            return { success: false, message: 'Error al verificar aforo.' };
        }

        let currentCovers = 0;
        if (activeReservations) {
            for (const res of activeReservations) {
                const resStart = new Date(`${res.date}T${res.time}`);
                const resEnd = new Date(resStart.getTime() + DURATION_MS);

                if (requestedDate < resEnd && requestedEnd > resStart) {
                    currentCovers += res.party_size;
                }
            }
        }

        if (currentCovers + partySize > maxCapacity) {
            return { success: false, message: 'Lo sentimos, no hay aforo disponible para esa hora.' };
        }
    }

    // Determine Status
    reservationStatus = autoConfirm ? 'confirmed' : 'pending';

    // Insert into DB
    const { error } = await supabase.from('reservations').insert({
        date,
        time,
        party_size: partySize,
        name,
        email,
        phone,
        status: reservationStatus,
        table_id: assignedTableId
    });

    if (error) {
        console.error('Reservation Error:', error);
        return { success: false, message: 'Hubo un error al procesar tu reserva. Inténtalo de nuevo.' };
    }

    revalidatePath('/admin/bookings');

    if (reservationStatus === 'pending') {
        return { success: true, message: 'Solicitud recibida. Recibirás una confirmación pronto.' };
    }
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
