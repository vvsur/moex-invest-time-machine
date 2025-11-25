"use client";

import { useEffect } from "react";

interface ToastProps {
    message: string;
    type?: "error" | "success";
    onClose: () => void;
}

export function Toast({ message, type = "error", onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="
            fixed top-5 right-5 z-50
            px-4 py-3 rounded-lg shadow-lg
            text-white text-sm font-medium
            animate-fade-in
        "
            style={{
                backgroundColor: type === "error" ? "#E31E24" : "#0A7B0A",
            }}
        >
            {message}
        </div>
    );
}
