"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from 'next/link';
import { ArrowLeft, Heart, MessageSquare, Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";

interface Comment {
    _id: string;
    text: string;
    user: { _id: string; name: string };
    createdAt: string;
}

interface Blog {
    _id: string;
    title: string;
    content: string;
    image: string;
    likes: string[];
    comments: Comment[];
    createdAt: string;
    author: {
        name: string;
    };
}

export default function BlogDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { user } = useAuth();

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [isLiking, setIsLiking] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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

    const handleLike = async () => {
        if (!user) {
            alert("You need to log in to like a blog!");
            return;
        }
        setIsLiking(true);
        try {
            const res = await fetch(`/api/blogs/${id}/like`, { method: 'POST' });
            const data = await res.json();
            if (data.success && blog) {
                setBlog({ ...blog, likes: data.likes });
            }
        } catch (error) {
            console.error("Failed to like", error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("You need to log in to post a comment!");
            return;
        }
        if (!commentText.trim()) return;

        setIsSubmittingComment(true);
        try {
            const res = await fetch(`/api/blogs/${id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: commentText }),
            });
            const data = await res.json();
            if (data.success && blog) {
                setBlog({ ...blog, comments: data.comments });
                setCommentText("");
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-[#2a0e61] via-[#4c1d95] to-[#000000] flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">Loading Blog...</div>
        </div>
    );

    if (!blog) return (
        <div className="min-h-screen bg-gradient-to-br from-[#2a0e61] via-[#4c1d95] to-[#000000] flex items-center justify-center">
            <div className="text-gray-400 text-xl">Blog not found</div>
        </div>
    );

    const hasLiked = user && blog.likes?.includes(user.id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2a0e61] via-[#4c1d95] to-[#000000]">
            <Navbar />
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>

                    <article className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden mb-8">
                        {blog.image && (
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-96 object-cover"
                            />
                        )}

                        <div className="p-8 md:p-12">
                            <header className="mb-8 border-b border-white/10 pb-8">
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                                    {blog.title}
                                </h1>
                                <div className="flex items-center justify-between text-gray-400 text-sm">
                                    <div className="flex items-center">
                                        <span className="text-purple-300 font-medium">By {blog.author?.name || 'Unknown'}</span>
                                        <span className="mx-3">•</span>
                                        <time dateTime={blog.createdAt}>
                                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </time>
                                    </div>
                                </div>
                            </header>

                            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                                {blog.content}
                            </div>

                            {/* Instagram Style Actions */}
                            <div className="mt-12 pt-6 border-t border-white/10 flex items-center space-x-6">
                                <button
                                    onClick={handleLike}
                                    disabled={isLiking}
                                    className={`flex items-center space-x-2 transition-all ${hasLiked ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-red-400'}`}
                                >
                                    <Heart className="w-8 h-8 transition-transform active:scale-75" fill={hasLiked ? "currentColor" : "none"} />
                                    <span className="text-lg font-bold">{blog.likes?.length || 0}</span>
                                </button>
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <MessageSquare className="w-8 h-8" />
                                    <span className="text-lg font-bold">{blog.comments?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Comments Section */}
                    <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Comments ({blog.comments?.length || 0})</h3>

                        {/* Comment Input */}
                        <form onSubmit={handleComment} className="mb-8 relative user-form">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder={user ? "Add a comment..." : "Log in to post a comment..."}
                                disabled={!user || isSubmittingComment}
                                rows={3}
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a855f7] resize-none transition-all disabled:opacity-50"
                            />
                            <div className="absolute bottom-3 right-3">
                                <button
                                    type="submit"
                                    disabled={!user || !commentText.trim() || isSubmittingComment}
                                    className="p-2 bg-[#a855f7] text-white rounded-lg hover:bg-[#9333ea] disabled:bg-gray-700 disabled:text-gray-500 transition-colors shadow-lg"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-6">
                            {(blog.comments || []).length === 0 ? (
                                <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
                            ) : (
                                blog.comments.map((comment, index) => (
                                    <div key={comment._id || index} className="flex space-x-4 animate-fadeIn">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#a855f7] to-[#4c1d95] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                            {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <div className="flex-1 bg-[#0f172a]/60 rounded-2xl rounded-tl-none p-4 border border-white/5">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-200">{comment.user?.name || 'Unknown User'}</h4>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-sm whitespace-pre-wrap">{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
