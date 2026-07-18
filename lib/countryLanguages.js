import countriesTopology from "../public/countries.json"
import { feature } from "topojson-client"

const worldFeatures = feature(countriesTopology, countriesTopology.objects.world).features
const ID_TO_NAME = Object.fromEntries(
  worldFeatures.map((f) => [f.id, f.properties?.name ?? f.id])
)

export function getCountryNameFromId(iso3) {
  return ID_TO_NAME[iso3] ?? iso3
}

/** ISO 3166-1 alpha-3 → { lang, locale, label } for translation + speech */
export const COUNTRY_LANGUAGES = {
  AFG: { lang: "fa", locale: "fa-IR", label: "Persian / Dari" },
  ALB: { lang: "sq", locale: "sq-AL", label: "Albanian" },
  DZA: { lang: "ar", locale: "ar-DZ", label: "Arabic" },
  ARG: { lang: "es", locale: "es-AR", label: "Spanish" },
  AUS: { lang: "en", locale: "en-AU", label: "English" },
  AUT: { lang: "de", locale: "de-AT", label: "German" },
  BEL: { lang: "nl", locale: "nl-BE", label: "Dutch" },
  BRA: { lang: "pt", locale: "pt-BR", label: "Portuguese" },
  BGR: { lang: "bg", locale: "bg-BG", label: "Bulgarian" },
  CAN: { lang: "en", locale: "en-CA", label: "English" },
  CHL: { lang: "es", locale: "es-CL", label: "Spanish" },
  CHN: { lang: "zh", locale: "zh-CN", label: "Chinese" },
  COL: { lang: "es", locale: "es-CO", label: "Spanish" },
  HRV: { lang: "hr", locale: "hr-HR", label: "Croatian" },
  CZE: { lang: "cs", locale: "cs-CZ", label: "Czech" },
  DNK: { lang: "da", locale: "da-DK", label: "Danish" },
  EGY: { lang: "ar", locale: "ar-EG", label: "Arabic" },
  FIN: { lang: "fi", locale: "fi-FI", label: "Finnish" },
  FRA: { lang: "fr", locale: "fr-FR", label: "French" },
  DEU: { lang: "de", locale: "de-DE", label: "German" },
  GRC: { lang: "el", locale: "el-GR", label: "Greek" },
  HUN: { lang: "hu", locale: "hu-HU", label: "Hungarian" },
  ISL: { lang: "is", locale: "is-IS", label: "Icelandic" },
  IND: { lang: "hi", locale: "hi-IN", label: "Hindi" },
  IDN: { lang: "id", locale: "id-ID", label: "Indonesian" },
  IRN: { lang: "fa", locale: "fa-IR", label: "Persian" },
  IRQ: { lang: "ar", locale: "ar-IQ", label: "Arabic" },
  IRL: { lang: "en", locale: "en-IE", label: "English" },
  ISR: { lang: "he", locale: "he-IL", label: "Hebrew" },
  ITA: { lang: "it", locale: "it-IT", label: "Italian" },
  JPN: { lang: "ja", locale: "ja-JP", label: "Japanese" },
  KOR: { lang: "ko", locale: "ko-KR", label: "Korean" },
  MEX: { lang: "es", locale: "es-MX", label: "Spanish" },
  NLD: { lang: "nl", locale: "nl-NL", label: "Dutch" },
  NZL: { lang: "en", locale: "en-NZ", label: "English" },
  NOR: { lang: "nb", locale: "nb-NO", label: "Norwegian" },
  PAK: { lang: "ur", locale: "ur-PK", label: "Urdu" },
  PER: { lang: "es", locale: "es-PE", label: "Spanish" },
  PHL: { lang: "tl", locale: "fil-PH", label: "Filipino" },
  POL: { lang: "pl", locale: "pl-PL", label: "Polish" },
  PRT: { lang: "pt", locale: "pt-PT", label: "Portuguese" },
  ROU: { lang: "ro", locale: "ro-RO", label: "Romanian" },
  RUS: { lang: "ru", locale: "ru-RU", label: "Russian" },
  SAU: { lang: "ar", locale: "ar-SA", label: "Arabic" },
  SRB: { lang: "sr", locale: "sr-RS", label: "Serbian" },
  SVK: { lang: "sk", locale: "sk-SK", label: "Slovak" },
  SVN: { lang: "sl", locale: "sl-SI", label: "Slovenian" },
  ZAF: { lang: "en", locale: "en-ZA", label: "English" },
  ESP: { lang: "es", locale: "es-ES", label: "Spanish" },
  SWE: { lang: "sv", locale: "sv-SE", label: "Swedish" },
  CHE: { lang: "de", locale: "de-CH", label: "German" },
  TWN: { lang: "zh", locale: "zh-TW", label: "Chinese" },
  THA: { lang: "th", locale: "th-TH", label: "Thai" },
  TUR: { lang: "tr", locale: "tr-TR", label: "Turkish" },
  UKR: { lang: "uk", locale: "uk-UA", label: "Ukrainian" },
  ARE: { lang: "ar", locale: "ar-AE", label: "Arabic" },
  GBR: { lang: "en", locale: "en-GB", label: "English" },
  USA: { lang: "en", locale: "en-US", label: "English" },
  VNM: { lang: "vi", locale: "vi-VN", label: "Vietnamese" },
}

export const PLAY_COUNTRY_POOL = Object.keys(COUNTRY_LANGUAGES)

export function getLanguageMeta(iso3) {
  return COUNTRY_LANGUAGES[iso3] ?? { lang: "en", locale: "en-US", label: "English" }
}

export function pickRandomCountryId() {
  const pool = PLAY_COUNTRY_POOL
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getDailySeedKey(date = new Date()) {
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(date.getUTCDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Same country for all users for a given UTC day.
 */
export function pickDailyCountryId(date = new Date()) {
  const key = getDailySeedKey(date)
  let hash = 2166136261
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  const idx = Math.abs(hash) % PLAY_COUNTRY_POOL.length
  return PLAY_COUNTRY_POOL[idx]
}
