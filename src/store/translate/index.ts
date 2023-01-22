// @ts-expect-error something is wrong with i18n-js direct import
import { I18n } from "i18n-js/dist/require"

import ES from "store/translate/es"

const i18n = new I18n({
  es: ES,
})

i18n.defaultLocale = "en"
i18n.locale = "en"

export type GaloyTranslate = (
  scope: keyof typeof ES,
  options?: I18n.TranslateOptions | undefined,
) => string

export const translate: GaloyTranslate = (scope, options) => {
  const translation = i18n.t(scope, { defaultValue: scope, ...options })
  return translation
}

export type GaloyTranslateUnknown = (
  scope: string,
  options?: I18n.TranslateOptions | undefined,
) => string

export const translateUnknown: GaloyTranslateUnknown = (scope, options) => {
  const translation = i18n.t(scope, { defaultValue: scope, ...options })
  return translation
}

export const setLocale = (language: string | undefined): void => {
  if (language && language !== "DEFAULT" && i18n.locale !== language) {
    i18n.locale = language
  }
}

export const getLocale = (): string => {
  return i18n.locale
}
