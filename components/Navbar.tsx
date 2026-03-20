"use client";

import { useAuth } from '@/context/AuthContext';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-transparent border-b border-white/10 z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-white tracking-tight">
                                TechBlog
                            </span>
                        </Link>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                        <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Home
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/add-blog" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Add Blog
                                </Link>

                                {user.role === 'admin' && (
                                    <Link href="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        Dashboard
                                    </Link>
                                )}

                                <div className="flex items-center space-x-2 text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/5">
                                    <UserIcon className="w-4 h-4" />
                                    <span>{user.name}</span>
                                </div>

                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-[#a855f7] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#9333ea] transition-colors shadow-lg shadow-purple-500/20">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden bg-[#1e293b] border-t border-white/10 absolute w-full left-0 top-16 shadow-2xl">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link href="/" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                            Home
                        </Link>
                        {user && (
                            <Link href="/add-blog" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                                Add Blog
                            </Link>
                        )}
                        {user && user.role === 'admin' && (

                            <Link href="/admin" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                                Dashboard
                            </Link>
                        )}
                        {!user && (
                            <>
                                <Link href="/login" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                                    Login
                                </Link>
                                <Link href="/register" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                                    Register
                                </Link>
                            </>
                        )}
                        {user && (
                            <button onClick={logout} className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-400 hover:bg-white/5">
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
