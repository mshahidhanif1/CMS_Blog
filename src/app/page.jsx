"use client"
import React from "react";
import { useState } from "react";
import { useTheme } from "next-themes";
export default function Homepage() {
  const { theme, setTheme } = useTheme();
  console.log(theme);
  return (
    <div className="h-screen flex gap-10 items-center justify-center w-screen bg-blue-200 dark:bg-gray-800">
      <h1 className="text-black dark:text-red-600">Homepage</h1>
      <code>ihj</code>

      <button
        onClick={() => setTheme("light")}
        className="text-white dark:text-blue-600"
      >
        Toggle Theme
      </button>
      <button onClick={() => setTheme("dark")} className="cursor-pointer">Toggle Theme</button>
      <button onClick={() => setTheme("system")} className="cursor-pointer">System</button>
    </div>
  );
}