"use client";

import { Mail, Lock, Eye, Info } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      login(data.user);
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#2a0e61] via-[#4c1d95] to-[#000000]">
      <div className="w-full max-w-md px-8 py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Welcome to Boom</h1>
            <p className="text-gray-300 text-sm">Enter your email and password to continue.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-start mb-6">
            <Info className="w-5 h-5 text-blue-400 opacity-80" />
          </motion.div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-medium text-gray-300 block ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 bg-[#1e293b] border border-transparent rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-[#0f172a] transition-all sm:text-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-medium text-gray-300 block ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-10 py-3 bg-[#1e293b] border border-transparent rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-[#0f172a] transition-all sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                </div>
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#a855f7] hover:bg-[#9333ea] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a855f7] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </motion.button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/register" className="text-gray-400 text-xs hover:text-white transition-colors">
              Don't have an account? Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
