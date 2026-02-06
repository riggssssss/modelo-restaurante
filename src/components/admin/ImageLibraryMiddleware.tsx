'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Image {
    name: string;
    url: string;
}

interface ImageLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export default function ImageLibrary({ isOpen, onClose, onSelect }: ImageLibraryProps) {
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchImages();
            // Lock body scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Unlock body scroll
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/images');
            const data = await res.json();
            if (data.images) {
                setImages(data.images);
            }
        } catch (error) {
            console.error('Failed to fetch images', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/images', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                await fetchImages();
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, name: string) => {
        e.stopPropagation();
        if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return;

        try {
            const res = await fetch(`/api/images?name=${name}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchImages();
            } else {
                alert('Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting', error);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-white z-10 shrink-0">
                            <h2 className="text-2xl font-serif font-bold">Biblioteca de Imágenes</h2>
                            <div className="flex gap-4 items-center">
                                <label className={`
                                    cursor-pointer bg-black text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider 
                                    hover:bg-neutral-800 transition-colors flex items-center gap-2
                                    ${uploading ? 'opacity-50 pointer-events-none' : ''}
                                `}>
                                    <span>{uploading ? 'Subiendo...' : 'Subir Imagen'}</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleUpload}
                                        disabled={uploading}
                                    />
                                </label>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors focus:outline-none"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50">
                            {loading ? (
                                <div className="flex items-center justify-center h-full text-neutral-400">
                                    Cargando imágenes...
                                </div>
                            ) : images.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-4">
                                    <span className="text-4xl">🖼️</span>
                                    <p>No hay imágenes en la biblioteca.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {images.map((img) => (
                                        <div
                                            key={img.name}
                                            className="group relative aspect-square bg-white rounded-xl border border-neutral-200 overflow-hidden cursor-pointer hover:border-black hover:shadow-lg transition-all"
                                            onClick={() => {
                                                onSelect(img.url);
                                                onClose();
                                            }}
                                        >
                                            <img
                                                src={img.url}
                                                alt={img.name}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                                            {/* Delete Button */}
                                            <button
                                                onClick={(e) => handleDelete(e, img.name)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm z-20"
                                                title="Eliminar imagen"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>

                                            {/* Name Tag */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 text-xs truncate border-t border-neutral-100">
                                                {img.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
