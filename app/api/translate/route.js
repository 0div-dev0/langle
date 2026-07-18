import { NextResponse } from "next/server"

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const text = typeof body.text === "string" ? body.text.trim() : ""
  const targetLang = typeof body.targetLang === "string" ? body.targetLang.trim().toLowerCase() : ""

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 })
  }
  if (!targetLang) {
    return NextResponse.json({ error: "targetLang is required" }, { status: 400 })
  }

  const libreUrl = process.env.LIBRETRANSLATE_URL
  if (libreUrl) {
    try {
      const r = await fetch(`${libreUrl.replace(/\/$/, "")}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: targetLang,
          format: "text",
        }),
      })
      if (!r.ok) {
        const err = await r.text()
        return NextResponse.json({ error: err || "LibreTranslate failed" }, { status: 502 })
      }
      const data = await r.json()
      const translated = data.translatedText ?? data.data?.translatedText
      if (!translated) {
        return NextResponse.json({ error: "Unexpected LibreTranslate response" }, { status: 502 })
      }
      return NextResponse.json({ translatedText: translated })
    } catch (e) {
      return NextResponse.json({ error: e.message || "LibreTranslate error" }, { status: 502 })
    }
  }

  const pair = `en|${targetLang}`
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(pair)}`

  try {
    const r = await fetch(url, { next: { revalidate: 0 } })
    if (!r.ok) {
      return NextResponse.json({ error: "Translation service unavailable" }, { status: 502 })
    }
    const data = await r.json()
    const translated = data.responseData?.translatedText
    if (!translated) {
      return NextResponse.json({ error: "No translation returned" }, { status: 502 })
    }
    return NextResponse.json({ translatedText: translated })
  } catch (e) {
    return NextResponse.json({ error: e.message || "Translation failed" }, { status: 502 })
  }
}
