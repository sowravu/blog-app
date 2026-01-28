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

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <>
            <div className="bg-gradient-to-r from-[#2a0e61] to-[#000000]">
                <Navbar />
            </div>
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Post</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-gray-500">Title</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Author</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                                    <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                {blog.image && (
                                                    <img src={blog.image} alt="" className="w-10 h-10 rounded-md object-cover" />
                                                )}
                                                <span className="font-medium text-gray-900">{blog.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{blog.author?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button onClick={() => openEdit(blog)} className="text-blue-500 hover:text-blue-700">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(blog._id)} className="text-red-500 hover:text-red-700">
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {blogs.length === 0 && (
                            <div className="p-8 text-center text-gray-500">No blogs found. Create one!</div>
                        )}
                    </div>
                </div>

                {/* Modal for Create/Edit */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold">{editingBlog ? 'Edit Blog' : 'New Blog'}</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="file"
                                            onChange={handleImageUpload}
                                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                        {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                                    </div>
                                    {image && (
                                        <img src={image} alt="Preview" className="mt-2 h-32 w-auto rounded-lg object-cover" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea
                                        required
                                        rows={8}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>

                                <div className="pt-4 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {editingBlog ? 'Update' : 'Publish'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
