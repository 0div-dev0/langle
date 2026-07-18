"use client"

import React, { useEffect, useRef, useState } from "react"
import { ComposableMap, Geographies, Geography } from "@vnedyalk0v/react19-simple-maps"
import countriesTopology from "../../public/countries.json"

/**
 * Map for the language game: parent passes answer + guesses.
 */
export default function MapUI({
  answerCountryId,
  guessedCountryIds = [],
  guessedCountryNames = [],
  onCountryGuess,
  disabled = false,
  maxGuesses = 7,
  showReveal = false,
}) {
  const wrapRef = useRef(null)
  const [dims, setDims] = useState({ width: 680, height: 400 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = Math.max(280, Math.round(entries[0]?.contentRect.width ?? 800))
      const h = w < 520 ? Math.round(w * 0.72) : Math.max(280, Math.round(w * 0.48))
      setDims({ width: w, height: h })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scale = Math.max(85, Math.min(220, 147 * (dims.width / 800)))

  const getCountryId = (geo) => geo?.id ?? geo?.properties?.iso_a3 ?? geo?.properties?.iso_a2 ?? null
  const getCountryName = (geo) => geo?.properties?.name ?? geo?.id ?? "Unknown"

  const baseFill = "#cbd5e1"

  const getCountryFill = (geo) => {
    const id = getCountryId(geo)
    if (!guessedCountryIds.includes(id)) {
      if (showReveal && answerCountryId && id === answerCountryId) return "#22c55e"
      return baseFill
    }
    if (answerCountryId && id === answerCountryId) return "#22c55e"
    return "#f59e0b"
  }

  const handleClick = (geo) => {
    const id = getCountryId(geo)
    const name = getCountryName(geo)
    if (disabled || guessedCountryIds.length >= maxGuesses) return
    if (guessedCountryIds.includes(id)) return
    onCountryGuess?.(id, name)
  }

  return (
    <div
      ref={wrapRef}
      className="w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-inner"
    >
      <div className="border-b border-white/5 px-3 py-2 text-center text-xs text-slate-400 md:text-sm">
        {guessedCountryNames.length > 0 ? (
          <span className="text-slate-200">
            Guesses ({guessedCountryNames.length}/{maxGuesses}):{" "}
            <span className="font-medium text-white">{guessedCountryNames.join(" · ")}</span>
          </span>
        ) : (
          <span>Tap a country on the map to guess</span>
        )}
      </div>
      <div className="flex justify-center p-1 md:p-2">
        <ComposableMap
          projectionConfig={{ scale }}
          width={dims.width}
          height={dims.height}
          className="max-w-full"
        >
          <Geographies geography={countriesTopology}>
            {({ geographies = [] }) =>
              geographies.map((geo) => (
                <Geography
                  key={getCountryId(geo) ?? getCountryName(geo)}
                  geography={geo}
                  onClick={() => handleClick(geo)}
                  style={{
                    default: { fill: getCountryFill(geo), outline: "none", stroke: "#0f172a", strokeWidth: 0.35 },
                    hover: {
                      fill: guessedCountryIds.includes(getCountryId(geo))
                        ? getCountryFill(geo)
                        : showReveal && answerCountryId && getCountryId(geo) === answerCountryId
                        ? "#22c55e"
                        : "#94a3b8",
                      outline: "none",
                      stroke: "#0f172a",
                      strokeWidth: 0.35,
                    },
                    pressed: { fill: getCountryFill(geo), outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  )
}
