"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MdLanguage, MdPublic, MdSchool, MdEmojiEvents, MdMenu, MdClose } from "react-icons/md"
import AccBtns from "./AccBtns"
import Logo from "./Logo"
import { useState, useEffect } from "react"

const linkClass = (active) => [
  "relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
  active
    ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/20 text-white shadow-lg shadow-violet-500/20"
    : "text-slate-300/80 hover:bg-white/5 hover:text-white hover:shadow-md",
].join(" ")

const Navbar = () => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home", icon: MdLanguage },
    { href: "/play", label: "Play", icon: MdPublic },
    { href: "/daily", label: "Daily", icon: MdSchool },
    { href: "/tutorial", label: "Tutorial", icon: MdEmojiEvents, disabled: true },
    { href: "/games", label: "Games", icon: MdEmojiEvents, disabled: true },
  ]

  return (
    <>
      <header
        className={`sticky pt-5 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-violet-500/5"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Langle Home">
            <Logo className="h-10 w-auto" />
            <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
              
            </span>
          </Link>

          <nav className="hidden md:flex md:flex-1 md:justify-center" aria-label="Main navigation">
            <ul className="flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon, disabled }) => (
                <li key={href}>
                  {disabled ? (
                    <span
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed"
                      title="Coming soon"
                    >
                      <Icon className="h-4 w-4 opacity-50" />
                      {label}
                      <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">Soon</span>
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className={linkClass(pathname === href)}
                      aria-current={pathname === href ? "page" : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-1 justify-end items-center gap-3">
            <AccBtns />
            
            <button
              className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <MdClose className="h-6 w-6" /> : <MdMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-nav" className="md:hidden animate-slide-down bg-slate-950/95 backdrop-blur-xl border-t border-white/5 px-4 pb-4">
            <ul className="flex flex-col gap-2 mt-2">
              {navLinks.map(({ href, label, icon: Icon, disabled }) => (
                <li key={href}>
                  {disabled ? (
                    <span className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-slate-500 cursor-not-allowed">
                      <Icon className="h-5 w-5 opacity-50" />
                      {label}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                        pathname === href
                          ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/20 text-white"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <style jsx global>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.2s ease-out; }
      `}</style>
    </>
  )
}

export default Navbar