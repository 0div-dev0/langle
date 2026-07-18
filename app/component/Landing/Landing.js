"use client"

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MdLanguage, MdPublic, MdSchool, MdHeadphones, MdTranslate, MdAutoAwesome, MdArrowRight, MdVerified } from 'react-icons/md'
import Navbar from '../Navbar'
import AuthModal from '../AuthModal'

const features = [
  { icon: MdPublic, title: "World Languages", desc: "Guess languages from 195+ countries around the globe", color: "from-violet-500 to-indigo-500" },
  { icon: MdHeadphones, title: "Listen & Learn", desc: "Hear native pronunciation with text-to-speech", color: "from-sky-500 to-cyan-500" },
  { icon: MdTranslate, title: "Real Translations", desc: "See phrases translated into the mystery language", color: "from-emerald-500 to-teal-500" },
  { icon: MdSchool, title: "Daily Challenges", desc: "New country every day — same for everyone worldwide", color: "from-amber-500 to-orange-500" },
  { icon: MdAutoAwesome, title: "Streak Tracking", desc: "Build streaks, unlock achievements, track progress", color: "from-pink-500 to-rose-500" },
  { icon: MdVerified, title: "Verified Content", desc: "Curated phrases from native speakers & linguists", color: "from-indigo-500 to-purple-500" },
]

const stats = [
  { value: "195+", label: "Countries" },
  { value: "7", label: "Guesses/Day" },
  { value: "∞", label: "Free Rounds" },
  { value: "24h", label: "Daily Reset" },
]

const Landing = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" /></div>
  if (session) { router.push("/play"); return null }

  return (
    <div className="relative min-h-screen page-bg grid-pattern overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-violet-500/20 to-transparent blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-sky-500/20 to-transparent blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-violet-500/5 to-sky-500/5 blur-3xl" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col">
        <section className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300 border border-violet-500/20">
                <MdAutoAwesome className="h-4 w-4" />
                New: Daily Challenge Mode
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl md:text-8xl animate-fade-up" style={{ animationDelay: '100ms' }}>
              <span className="bg-gradient-to-r from-white via-violet-200 to-sky-200 bg-clip-text text-transparent">
                Guess the
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
                Language
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300/80 sm:text-xl animate-fade-up" style={{ animationDelay: '200ms' }}>
              Listen to phrases from around the world. Identify the language. Find the country on the map.
              Build your linguistic intuition — one guess at a time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <button
                onClick={() => setIsOpen(true)}
                className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <MdArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                Start Playing
              </button>
              <a
                href="/daily"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-slate-200 transition-all hover:bg-white/10 hover:border-white/20 hover:text-white"
              >
                <MdLanguage className="h-5 w-5" />
                Try Daily
              </a>
            </div>
          </div>
        </section>

        <section className="relative z-10 py-20 px-4 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <article
                  key={feature.title}
                  className="group relative rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/7 hover:shadow-xl hover:shadow-violet-500/5 animate-fade-up"
                  style={{ animationDelay: `${400 + i * 100}ms` }}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br" style={{ background: feature.color }}>
                    <feature.icon className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
</article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 py-20 px-4 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-sky-500/10 p-8 md:p-12 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="text-center animate-fade-up" style={{ animationDelay: `${600 + i * 100}ms` }}>
                    <div className="mb-2 text-4xl font-bold bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent sm:text-5xl md:text-6xl">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 py-20 px-4 md:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl animate-fade-up">
              Ready to explore the world&apos;s languages?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-slate-400 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Join thousands of language lovers. No account needed to start playing.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
            >
              <MdArrowRight className="h-5 w-5" />
              Play Now
            </button>
          </div>
        </section>

        <footer className="relative z-10 border-t border-white/5 py-12 px-4 md:py-16">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm text-slate-500">
              Made with {'\u2764\uFE0F'} for language learners everywhere
            </p>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-600">
              <a href="/privacy" className="hover:text-slate-400 transition">Privacy</a>
              <a href="/terms" className="hover:text-slate-400 transition">Terms</a>
              <a href="/contact" className="hover:text-slate-400 transition">Contact</a>
            </div>
          </div>
        </footer>
      </main>

      <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} />

      <style jsx global>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-fade-up { animation: fade-up 0.6s ease-out forwards; opacity: 0; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .page-bg {
          background: 
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139, 92, 246, 0.15), transparent),
            radial-gradient(ellipse 60% 50% at 100% 100%, rgba(6, 182, 212, 0.1), transparent),
            radial-gradient(ellipse 50% 40% at 0% 0%, rgba(245, 158, 11, 0.08), transparent),
            var(--background);
        }
      `}</style>
    </div>
  )
}

export default Landing