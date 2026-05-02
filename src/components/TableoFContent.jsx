"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState("");

    console.log("scrollY:", window.scrollY)  // how far scrolled in px
  console.log("scrollYProgress:", window.scrollY / document.body.scrollHeight)  // 0 to 1
  useEffect(() => {
    const handleScroll = () => {     
      const headingElements = headings
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean)

      for (const el of headingElements) {
        const rect = el.getBoundingClientRect()
        if (rect.top >= 0 && rect.top <= window.innerHeight * 0.35) {
          setActiveId(el.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // run once on mount
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

  if (headings.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-24 w-64 shrink-0 hidden xl:block"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
        On this page
      </p>

      <motion.ul
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } }
        }}
        className="space-y-2 border-l border-gray-200 dark:border-gray-800"
      >
        {headings.map((h) => (
          <motion.li
            key={h.id}
            variants={{
              hidden: { opacity: 0, x: 10 },
              visible: { opacity: 1, x: 0 }
            }}
            className="relative"
          >
            {/* Animated active indicator */}
            {activeId === h.id && (
              <motion.span
                layoutId="activeIndicator"
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            <a
              href={`#${h.id}`}
              className={`block py-1 text-sm transition-all -ml-px border-l-2 ${
                h.level === "h3" ? "pl-7 text-xs" : "pl-4"
              } ${
                activeId === h.id
                  ? "border-transparent text-blue-500 font-semibold"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {h.text}
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}