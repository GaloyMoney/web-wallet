import config from "../store/config"

export type AuthSession = {
  galoyJwtToken: string
} | null

const galoySessionName = "galoy-session"

export const getPersistedSession = (galoyJwtToken: string | undefined): AuthSession => {
  if (galoyJwtToken) {
    return {
      galoyJwtToken,
    }
  } else if (config.isBrowser) {
    const session = window.localStorage.getItem(galoySessionName)
    if (session) {
      return JSON.parse(session)
    }
  }
  return null
}
export const clearSession = () => {
  if (config.isBrowser) {
    window.localStorage.removeItem(galoySessionName)
  }
}
