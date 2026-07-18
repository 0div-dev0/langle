"use client"

import { SlFire } from "react-icons/sl";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { HiOutlineArrowPath } from "react-icons/hi2"
import { MdTranslate, MdVolumeUp } from "react-icons/md"
import MapUI from "./MapUI"
import {
  getDailySeedKey,
  getCountryNameFromId,
  getLanguageMeta,
  pickDailyCountryId,
  pickRandomCountryId,
} from "@/lib/countryLanguages"
import { loadVoices, speakText } from "@/lib/speak"

const DEFAULT_PHRASE = "Hello world"
const MAX_GUESSES = 7

function newRound() {
  const countryId = pickRandomCountryId()
  const meta = getLanguageMeta(countryId)
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    countryId,
    countryName: getCountryNameFromId(countryId),
    langCode: meta.lang,
    locale: meta.locale,
    langLabel: meta.label,
    sentenceEn: DEFAULT_PHRASE,
    translated: "",
    translating: false,
    translateError: "",
    guessIds: [],
    guessNames: [],
  }
}

function createRoundForCountry(countryId) {
  const meta = getLanguageMeta(countryId)
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    countryId,
    countryName: getCountryNameFromId(countryId),
    langCode: meta.lang,
    locale: meta.locale,
    langLabel: meta.label,
    sentenceEn: DEFAULT_PHRASE,
    translated: "",
    translating: false,
    translateError: "",
    guessIds: [],
    guessNames: [],
  }
}

export default function DailyGame({ mode = "classic" }) {
  const isDailyMode = mode === "daily"
  const [games, setGames] = useState([])
  const [cursor, setCursor] = useState(0)
  const [phraseDraft, setPhraseDraft] = useState(DEFAULT_PHRASE)

  useEffect(() => {
    loadVoices(() => {})
    if (isDailyMode) {
      const dailyKey = getDailySeedKey()
      const countryId = pickDailyCountryId()
      const base = createRoundForCountry(countryId)
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(`dailyRound:${dailyKey}`)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            setGames([{ ...base, ...parsed, countryId, countryName: getCountryNameFromId(countryId) }])
            setCursor(0)
            return
          } catch {}
        }
      }
      setGames([base])
      setCursor(0)
      return
    }
    setGames([newRound()])
    setCursor(0)
  }, [isDailyMode])

  const current = games[cursor]
  const atLatest = cursor === games.length - 1
  const won = current && current.guessIds.includes(current.countryId)
  const lost = current && !won && current.guessIds.length >= MAX_GUESSES
  const [showReveal, setShowReveal] = useState(false)

  useEffect(() => {
    if (!current) return
    setPhraseDraft(current.sentenceEn)
  }, [current])

  const translate = useCallback(async () => {
    if (!current) return
    const text = phraseDraft.trim() || DEFAULT_PHRASE
    setGames((prev) =>
      prev.map((g, i) =>
        i === cursor ? { ...g, sentenceEn: text, translating: true, translateError: "" } : g
      )
    )
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang: current.langCode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Translation failed")
      setGames((prev) =>
        prev.map((g, i) =>
          i === cursor
            ? { ...g, translated: data.translatedText, translating: false, translateError: "" }
            : g
        )
      )
    } catch (e) {
      setGames((prev) =>
        prev.map((g, i) =>
          i === cursor
            ? { ...g, translating: false, translateError: e.message || "Could not translate" }
            : g
        )
      )
    }
  }, [current, cursor, phraseDraft])

  const translateRef = useRef(translate)
  translateRef.current = translate

  useEffect(() => {
    if (!current || !atLatest) return
    const t = setTimeout(() => translateRef.current(), 480)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, current?.langCode, phraseDraft, atLatest])

  const goPrev = () => {
    setShowReveal(false)
    setCursor((c) => Math.max(0, c - 1))
  }

  const goNext = () => {
    if (isDailyMode) return
    setShowReveal(false)
    if (cursor < games.length - 1) {
      setCursor((c) => c + 1)
      return
    }
    setGames((prev) => [...prev, newRound()])
    setCursor((c) => c + 1)
  }

  const onCountryGuess = (id, name) => {
    if (!current || !atLatest || won || lost) return
    const nextGames = games.map((g, i) => {
      if (i !== cursor) return g
      if (g.guessIds.includes(id)) return g
      return {
        ...g,
        guessIds: [...g.guessIds, id],
        guessNames: [...g.guessNames, name],
      }
    })
    setGames(nextGames)
    if (isDailyMode && typeof window !== "undefined") {
      const dailyKey = getDailySeedKey()
      localStorage.setItem(`dailyRound:${dailyKey}`, JSON.stringify(nextGames[0]))
    }
  }

  useEffect(() => {
    if (!isDailyMode || !current || typeof window === "undefined") return
    const dailyKey = getDailySeedKey()
    localStorage.setItem(`dailyRound:${dailyKey}`, JSON.stringify(current))
  }, [current, isDailyMode])

  const playAudio = () => {
    if (!current?.translated) return
    speakText(current.translated, current.locale)
  }

  const subtitle = useMemo(() => {
    if (!current) return ""
    return `${current.langLabel} · ${current.langCode.toUpperCase()}`
  }, [current])

  if (!current) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-400">Loading…</div>
    )
  }

  return (
    <div className="relative w-full px-3 pb-12 pt-4 md:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.18),transparent)]"
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:gap-8">
        <section className="flex flex-1 flex-col gap-4 lg:max-w-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-2xl font-semibold uppercase tracking-[0.2em] text-violet-400/90">
                Guess the language
              </p>
              {/* <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                Guess the Language
              </h2> */}
              <p className="mt-1 text-sm text-[var(--foreground)]/55">
                Read the phrase, listen, then find the country on the map.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)]/60 p-1 shadow-sm backdrop-blur-sm">
              <button
                type="button"
                onClick={goPrev}
                disabled={isDailyMode || cursor === 0}
                className="rounded-xl px-3 py-2 text-sm font-medium text-[var(--foreground)]/90 transition hover:bg-[var(--foreground)]/10 disabled:cursor-not-allowed disabled:opacity-35"
              >
                ← Prev
              </button>
              <span className="px-2 text-xs text-[var(--foreground)]/50">
                {cursor + 1} / {games.length}
              </span>
              <button
                type="button"
                onClick={goNext}
                disabled={isDailyMode}
                className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-violet-900/30 transition hover:bg-violet-500"
              >
                Next →
              </button>
            </div>
          </div>

          {!isDailyMode && !atLatest && (
            <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
              Viewing round {cursor + 1}. Use <strong>Next</strong> to return to your latest round or
              start a new country.
            </p>
          )}
          {isDailyMode && (
            <p className="rounded-xl border border-sky-500/25 bg-sky-500/10 px-4 py-3 text-sm text-sky-200/90">
              Daily mode: same country for everyone today ({getDailySeedKey()}). Come back tomorrow
              for a new country.
            </p>
          )}

          <div className="rounded-3xl border border-[var(--foreground)]/10 bg-[var(--background)]/80 p-5 shadow-xl backdrop-blur-md md:p-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Your phrase</h3>
                <p className="mt-0.5 relative text-s flex items-center gap-2 text-[var(--foreground)]/45">Streak: <SlFire className="inline-block fill-amber-500 h-8 w-8" /> <span className="absolute right-6 top-2 text-white">0</span></p>
              </div>
              {(won || lost) && atLatest && (
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    won ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  {won ? "You found it!" : "No guesses left"}
                </span>
              )}
            </div>

            <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-[var(--foreground)]/40">
              English text
            </label>
            <textarea
              value={phraseDraft}
              onChange={(e) => setPhraseDraft(e.target.value)}
              disabled={!atLatest || won || lost}
              rows={3}
              className="mt-2 w-full resize-none rounded-2xl border border-[var(--foreground)]/12 bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none ring-violet-500/30 placeholder:text-[var(--foreground)]/35 focus:ring-2 disabled:opacity-50"
              placeholder={DEFAULT_PHRASE}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => translate()}
                disabled={current.translating || !atLatest}
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/25 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {current.translating ? (
                  <HiOutlineArrowPath className="h-5 w-5 animate-spin" />
                ) : (
                  <MdTranslate className="h-5 w-5" />
                )}
                Translate
              </button>
              <button
                type="button"
                onClick={playAudio}
                disabled={!current.translated}
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--foreground)]/15 bg-[var(--foreground)]/5 px-4 py-2.5 text-sm font-medium text-[var(--foreground)]/90 transition hover:bg-[var(--foreground)]/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MdVolumeUp className="h-5 w-5" />
                Hear it
              </button>
            </div>

            {current.translateError && (
              <p className="mt-3 text-sm text-rose-500">{current.translateError}</p>
            )}

            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-700/80 dark:text-emerald-300/80">
                In the mystery language
              </p>
              <p className="mt-2 text-lg font-medium leading-relaxed text-emerald-950 dark:text-emerald-50 md:text-xl">
                {current.translated || "…"}
              </p>
            </div>
          </div>

          <ul className="space-y-2 rounded-2xl border border-[var(--foreground)]/8 bg-[var(--foreground)]/[0.03] p-4 text-sm text-[var(--foreground)]/65">
            <li className="flex gap-2">
              <span className="text-violet-500">1.</span>
              Change the English phrase anytime; we translate into the round&apos;s language.
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500">2.</span>
              Use <strong className="text-[var(--foreground)]/85">Hear it</strong> for browser speech (device voices vary).
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500">3.</span>
              You have {MAX_GUESSES} country guesses per round.
            </li>
          </ul>
        </section>

        <section className="min-w-0 flex-1 lg:pt-2">
          <div className="overflow-hidden rounded-3xl border border-[var(--foreground)]/10 bg-slate-900/40 shadow-2xl backdrop-blur-sm dark:bg-slate-950/50">
            <div className="border-b border-[var(--foreground)]/10 px-4 py-3 md:px-5">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Map</p>
              {(won || showReveal) && atLatest && (
                <p className="mt-1 text-sm text-emerald-400">
                  Answer: <span className="font-semibold text-white">{current.countryName}</span>
                </p>
              )}
              {lost && atLatest && !showReveal && (
                <button
                  type="button"
                  onClick={() => setShowReveal(true)}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition animate-pulse"
                >
                  <span className="text-[10px]">👁</span>
                  Reveal country
                </button>
              )}
            </div>
            <div className="p-2 md:p-4">
              <MapUI
                key={current.id}
                answerCountryId={current.countryId}
                guessedCountryIds={current.guessIds}
                guessedCountryNames={current.guessNames}
                onCountryGuess={onCountryGuess}
                disabled={!atLatest || won || lost}
                maxGuesses={MAX_GUESSES}
                showReveal={showReveal || won}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
