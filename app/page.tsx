"use client";

import { useEffect, useState } from "react";
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  image: string;
  content: string; // Needed for snippet?
  createdAt: string;
  author: {
    name: string;
  };
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    // Updated background to match Login/Register pages
    <div className="min-h-screen bg-gradient-to-br from-[#2a0e61] via-[#4c1d95] to-[#000000]">
      <Navbar />
      <div>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl mb-4 tracking-tight">
              Latest from the Blog
            </h1>
            <p className="max-w-xl mx-auto text-xl text-gray-300">
              Discover insights, tutorials, and news about the latest technology trends.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-8 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white/5 h-96 rounded-lg shadow-sm animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
              {blogs.map((blog) => (
                <Link key={blog._id} href={`/blog/${blog._id}`} className="group flex flex-col rounded-xl shadow-lg border border-white/10 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 bg-[#1e293b]/50 backdrop-blur-sm h-full transform hover:-translate-y-1">
                  <div className="flex-shrink-0 relative overflow-hidden aspect-video w-full">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#0f172a] flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent opacity-60"></div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between relative">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-400 mb-2">
                        Article
                      </p>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-400 line-clamp-3">
                        {blog.content}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center pt-4 border-t border-white/10">
                      <div className="">
                        <p className="text-sm font-medium text-gray-200">
                          {blog.author?.name || 'Unknown'}
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500">
                          <time dateTime={blog.createdAt}>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && blogs.length === 0 && (
            <div className="text-center text-gray-400 py-12 bg-white/5 rounded-xl border border-white/10">
              No blogs found yet. Be the first to post!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
