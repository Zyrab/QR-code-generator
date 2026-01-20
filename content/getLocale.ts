import {landing as enLanding} from "./en/landing";

const en = {
  landing:enLanding
}
const ka = {
  landing:enLanding
}

export type Locale = "en" | "ka";
export type page = "landing"
export function getLocale(locale: Locale, page:page) {
  return locale === "en" ? en[page] : ka[page];
}