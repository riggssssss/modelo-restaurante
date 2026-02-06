import Sidebar from "@/components/admin/Sidebar";
import "../globals.css";

export const metadata = {
    title: "Keko Admin",
    description: "Restaurant Management System",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F2F4F7] font-sans flex">
            <Sidebar />
            <div className="flex-1 min-w-0">
                {/* Main Content Area - mimicking the card style from the reference */}
                <div className="min-h-screen p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
