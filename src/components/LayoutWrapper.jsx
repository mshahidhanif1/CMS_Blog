"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

const hideOn = ["admin", "login", "register"];

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  const showNavbar = !hideOn.includes(segment);
  const showFooter = !hideOn.includes(segment);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
      {showFooter && (
        <footer className="border-t border-gray-100 dark:border-gray-800 py-10 px-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} NexBlog. All rights reserved.</p>
        </footer>
      )}
    </>
  );
}