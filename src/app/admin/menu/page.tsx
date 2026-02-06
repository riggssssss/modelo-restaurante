import { getCategories } from "@/actions/menu";
import MenuManager from "@/components/admin/MenuManager";

export default async function AdminMenuPage() {
    const categories = await getCategories();

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-8 bg-white p-6 rounded-[2rem] border border-neutral-100">
                <div>
                    <h1 className="text-3xl font-serif mb-2">Editor de Menú</h1>
                    <p className="text-neutral-500 text-sm">Gestiona las categorías y platos de tu carta.</p>
                </div>
            </div>

            <MenuManager initialCategories={categories} />
        </div>
    );
}
