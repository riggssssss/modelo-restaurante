import { getReservations } from "@/actions/reservations";
import ReservationsCalendar from "@/components/admin/ReservationsCalendar";
import ReservationsList from "@/components/admin/ReservationsList";
import Link from "next/link";

export default async function AdminBookingsPage() {
    // Fetch bookings for a wide range (e.g. current year +/- 1 year)
    // For a real app we might want pagination or date filtering via params
    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);

    const reservations = await getReservations(start.toISOString(), end.toISOString());

    return (
        // No padding needed here as layout handles it, but we can add inner padding if needed
        <div className="max-w-7xl mx-auto">
            {/* Content Area */}
            <ReservationsManager reservations={reservations || []} />
        </div>
    );
}

// Client component wrapper to handle tabs state
import ReservationsManager from "@/components/admin/ReservationsManager";
