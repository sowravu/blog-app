"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function AddBlog() {
    const { user } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect to login if not authenticated
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#2a0e61] via-[#4c1d95] to-[#000000]">
                <p className="text-xl text-gray-300 mb-6">You need to be logged in to create a blog.</p>
                <button
                    onClick={() => router.push('/login')}
                    className="bg-[#a855f7] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#9333ea] transition-all shadow-lg shadow-purple-500/20"
                >
                    Login
                </button>
            </div>
        );
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setImage(data.data.secure_url);
            } else {
                alert('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error: any) {
            console.error(error);
            alert('Upload error: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const body = { title, content, image };

        try {
            const res = await fetch('/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                router.push('/');
            } else {
                const data = await res.json();
                alert(data.message || data.error || 'Failed to save blog');
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2a0e61] via-[#4c1d95] to-[#000000]">
            <Navbar />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-[#1e293b]/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10">
                    <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">Write a New Blog</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                            <input
                                type="text"
                                required
                                placeholder="Enter an engaging title..."
                                className="w-full px-4 py-3 bg-[#0f172a]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition-all"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                            <div className="flex items-center justify-between border-2 border-dashed border-white/20 rounded-xl p-4 hover:border-[#a855f7] transition-all bg-[#0f172a]/50">
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    className="text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#a855f7]/20 file:text-purple-300 hover:file:bg-[#a855f7]/30 transition-colors cursor-pointer"
                                />
                                {uploading && (
                                    <div className="flex items-center space-x-2 text-purple-400">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="text-sm font-medium">Uploading...</span>
                                    </div>
                                )}
                            </div>
                            {image && (
                                <div className="mt-4 rounded-xl overflow-hidden border border-white/10 shadow-lg relative group h-64">
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white font-medium">Cover Image Set!</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                            <textarea
                                required
                                rows={12}
                                placeholder="What's on your mind? Tell your story..."
                                className="w-full px-4 py-3 bg-[#0f172a]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition-all resize-y"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>

                        <div className="pt-6 flex justify-end space-x-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => router.push('/')}
                                className="px-6 py-3 text-gray-400 hover:text-white font-medium hover:bg-white/5 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading || isSubmitting}
                                className="px-8 py-3 bg-[#a855f7] text-white font-bold rounded-xl hover:bg-[#9333ea] hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:hover:shadow-none flex items-center"
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Blog'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
