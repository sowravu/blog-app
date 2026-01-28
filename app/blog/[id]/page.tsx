"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Blog {
    _id: string;
    title: string;
    content: string;
    image: string;
    createdAt: string;
    author: {
        name: string;
    };
}

export default function BlogDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const res = await fetch(`/api/blogs/${id}`);
            const data = await res.json();
            if (data.success) {
                setBlog(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!blog) return <div className="min-h-screen flex items-center justify-center">Blog not found</div>;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-12 pb-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>

                    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {blog.image && (
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-96 object-cover"
                            />
                        )}

                        <div className="p-8 md:p-12">
                            <header className="mb-8">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                                    {blog.title}
                                </h1>
                                <div className="flex items-center text-gray-500 text-sm">
                                    <span>By {blog.author?.name || 'Unknown'}</span>
                                    <span className="mx-2">•</span>
                                    <time dateTime={blog.createdAt}>
                                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </div>
                            </header>

                            <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {blog.content}
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
}
