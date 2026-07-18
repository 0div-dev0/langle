"use client"
import React, { useState, useEffect, useRef } from 'react'
import { MdAccountCircle } from "react-icons/md";
import { signOut } from 'next-auth/react';
import { TbDoorExit } from "react-icons/tb";
import { FaSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";


const AccOptions = () => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'light' || saved === 'dark') return saved
    } catch {}
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
  })

  // Apply theme globally.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    // `globals.css` drives theming via CSS variables on `:root`.
    // Override those variables directly so the UI switches immediately.
    if (theme === 'dark') {
      root.style.setProperty('--background', '#030712')
      root.style.setProperty('--foreground', '#ededed')
    } else {
      root.style.setProperty('--background', '#ffffff')
      root.style.setProperty('--foreground', '#171717')
    }
    try {
      localStorage.setItem('theme', theme)
    } catch {}
  }, [theme])


  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  return (
    <div ref={containerRef} className="relative flex px-2 py-2">
      <MdAccountCircle
        className="cursor-pointer text-3xl text-white"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      />
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-40 rounded-md border border-gray-600 bg-gray-900 py-1 text-white shadow-lg"
          role="menu"
        >
          <ul className="m-0 list-none p-0">
            <li
              role="menuitem"
              className="flex cursor-pointer items-center justify-center gap-2 px-3 py-2 text-sm hover:bg-gray-800"
              onClick={() => {
                setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
              }}
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />} Theme
            </li> 
              <li
                role="menuitem"
                className="flex cursor-pointer items-center justify-center gap-2 px-3 py-2 text-sm hover:bg-gray-800"
                onClick={() => signOut()}
              >
                <TbDoorExit aria-hidden /><span>Sign out</span>
              </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default AccOptions