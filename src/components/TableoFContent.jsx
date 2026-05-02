"use client";
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";

export default function TableOfContents({ headings }) {
    const [activeId, setActiveId] = useState("");
    const scrollYprogress = useScroll()
    console.log(JSON.stringify(scrollYprogress))
    

    if (headings.length === 0) return null;

    return (
        <div className="sticky top-24 w-64 shrink-0 hidden xl:block">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                On this page
            </p>
            <ul className="space-y-2 border-l border-gray-200 dark:border-gray-800">
                {headings.map((h) => (
                    <li key={h.id}>
                        <a

                            href={`#${h.id}`}
                            className={`block pl-4 py-1 text-sm transition-all border-l-2 -ml-px ${activeId === h.id
                                ? "border-blue-500 text-blue-500 font-semibold"
                                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                } ${h.level === "h3" ? "pl-7 text-xs" : ""}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            {h.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}