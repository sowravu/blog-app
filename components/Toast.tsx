"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
    message: string;
    isVisible: boolean;
    type?: "success" | "error";
}

export default function Toast({ message, isVisible, type = "success" }: ToastProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    className="fixed top-6 left-6 z-50 flex items-center space-x-3 bg-[#1e293b]/90 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl shadow-2xl shadow-purple-500/20"
                >
                    {type === "success" ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    <span className="text-white font-medium">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
