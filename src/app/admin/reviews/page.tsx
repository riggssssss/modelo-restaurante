'use client';

import { useState, useEffect } from 'react';
import { supabase, Review } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
        } else {
            setReviews(data || []);
        }
        setLoading(false);
    };

    const handleSave = async (formData: FormData) => {
        const review = {
            author: formData.get('author') as string,
            text: formData.get('text') as string,
            rating: parseInt(formData.get('rating') as string) || 5,
        };

        if (editingReview) {
            await supabase.from('reviews').update(review).eq('id', editingReview.id);
        } else {
            await supabase.from('reviews').insert(review);
        }

        setEditingReview(null);
        setIsCreating(false);
        fetchReviews();
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Eliminar esta reseña?')) {
            await supabase.from('reviews').delete().eq('id', id);
            fetchReviews();
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F5EE] font-sans">
            <nav className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight">
                    KEKO. <span className="text-xs font-medium text-neutral-400 ml-1 uppercase tracking-wider">Admin</span>
                </Link>
                <span className="text-sm text-neutral-500">Reviews Editor</span>
            </nav>

            <main className="p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif">Manage Reviews</h1>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                    >
                        + Add Review
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-neutral-400">Loading...</div>
                ) : reviews.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center text-neutral-400">
                        No reviews yet. Click &quot;Add Review&quot; to create one.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-2xl border border-neutral-100 p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold">{review.author}</h3>
                                        <div className="text-yellow-500 text-sm">
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingReview(review)}
                                            className="text-xs font-bold uppercase tracking-wider hover:text-blue-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="text-xs font-bold uppercase tracking-wider hover:text-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p className="text-neutral-600 text-sm italic">&quot;{review.text}&quot;</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal for Create/Edit */}
                {(isCreating || editingReview) && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-serif mb-4">{editingReview ? 'Edit Review' : 'New Review'}</h2>
                            <form action={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Author Name *</label>
                                    <input
                                        name="author"
                                        defaultValue={editingReview?.author || ''}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Review Text *</label>
                                    <textarea
                                        name="text"
                                        defaultValue={editingReview?.text || ''}
                                        rows={4}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm resize-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Rating (1-5)</label>
                                    <select
                                        name="rating"
                                        defaultValue={editingReview?.rating || 5}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                                    >
                                        {[5, 4, 3, 2, 1].map(n => (
                                            <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)} ({n})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => { setEditingReview(null); setIsCreating(false); }}
                                        className="flex-1 border border-neutral-200 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
