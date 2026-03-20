"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Trash, Edit, X } from "lucide-react";
import Link from 'next/link';
import Navbar from "@/components/Navbar";

interface Blog {
    _id: string;
    title: string;
    image: string;
    createdAt: string;
    author: {
        name: string;
    };
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await fetch('/api/blogs');
            const data = await res.json();
            if (data.success) {
                setBlogs(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setBlogs(blogs.filter(b => b._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

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

        const body = { title, content, image };

        try {
            const url = editingBlog ? `/api/blogs/${editingBlog._id}` : '/api/blogs';
            const method = editingBlog ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setShowModal(false);
                resetForm();
                fetchBlogs();
            } else {
                const data = await res.json();
                alert(data.message || data.error || 'Failed to save blog');
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Something went wrong');
        }
    };

    const openEdit = (blog: Blog) => {
        setEditingBlog(blog);
        setTitle(blog.title);
        setImage(blog.image);
        // Content is missing in list fetch, ideally fetch single or include content in list
        // For simplicity I'll assume I have to fetch it or store it.
        // Let's fetch the single blog to get content
        fetchSingle(blog._id);
        setShowModal(true);
    };

    const fetchSingle = async (id: string) => {
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (data.success) {
            setContent(data.data.content);
        }
    }

    const resetForm = () => {
        setTitle("");
        setContent("");
        setImage("");
        setEditingBlog(null);
    }

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-[#2a0e61] via-[#4c1d95] to-[#000000] flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">Loading Dashboard...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2a0e61] via-[#4c1d95] to-[#000000]">
            <Navbar />
            <div className="p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="flex items-center space-x-2 bg-[#a855f7] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#9333ea] transition-all shadow-lg shadow-purple-500/20"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New Post</span>
                        </button>
                    </div>

                    <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/10">
                        <table className="w-full text-left">
                            <thead className="bg-[#0f172a]/60 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-300">Title</th>
                                    <th className="px-6 py-4 font-semibold text-gray-300">Author</th>
                                    <th className="px-6 py-4 font-semibold text-gray-300">Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-300 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                {blog.image ? (
                                                    <img src={blog.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-[#0f172a] flex items-center justify-center border border-white/10 text-xs text-gray-500">No Img</div>
                                                )}
                                                <span className="font-medium text-gray-200">{blog.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{blog.author?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-4">
                                                <button onClick={() => openEdit(blog)} className="text-[#a855f7] hover:text-purple-400 transition-colors bg-[#a855f7]/10 p-2 rounded-lg hover:bg-[#a855f7]/20">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(blog._id)} className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 p-2 rounded-lg hover:bg-red-500/20">
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {blogs.length === 0 && (
                            <div className="p-12 text-center text-gray-400">No blogs found. Create one!</div>
                        )}
                    </div>
                </div>

                {/* Modal for Create/Edit */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0f172a]/40">
                                <h2 className="text-2xl font-bold text-white tracking-tight">{editingBlog ? 'Edit Blog' : 'New Blog'}</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg hover:bg-white/10">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition-all"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="file"
                                            onChange={handleImageUpload}
                                            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#a855f7]/20 file:text-purple-300 hover:file:bg-[#a855f7]/30 transition-colors cursor-pointer"
                                        />
                                        {uploading && <span className="text-sm text-purple-400 flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Uploading...</span>}
                                    </div>
                                    {image && (
                                        <img src={image} alt="Preview" className="mt-4 h-48 w-full rounded-xl object-cover border border-white/10" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                                    <textarea
                                        required
                                        rows={8}
                                        className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#a855f7] focus:border-transparent outline-none transition-all resize-y"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>

                                <div className="pt-6 flex justify-end space-x-3 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 text-gray-300 hover:text-white font-medium hover:bg-white/5 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="px-6 py-2.5 bg-[#a855f7] text-white font-bold rounded-xl hover:bg-[#9333ea] transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
                                    >
                                        {editingBlog ? 'Update Blog' : 'Publish Blog'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
