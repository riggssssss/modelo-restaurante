import { getTables } from '@/actions/tables';
import TableManager from '@/components/admin/TableManager';

export default async function TablesPage() {
    const tables = await getTables();

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8 bg-white p-6 rounded-[2rem] border border-neutral-100">
                <div>
                    <h1 className="text-3xl font-serif mb-2">Gestión de Mesas</h1>
                    <p className="text-neutral-500 text-sm">Define tu inventario de mesas para el control de aforo.</p>
                </div>
            </div>

            <TableManager initialTables={tables} />
        </div>
    );
}
