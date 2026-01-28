"use client";

import { motion } from "framer-motion";

export default function Transition({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <motion.div
                className="fixed inset-0 z-50 bg-black"
                initial={{ y: "0%" }}
                animate={{ y: "-100%" }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
            {children}
        </>
    );
}
