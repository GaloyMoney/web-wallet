import { useMemo, useState, ReactNode, useEffect, useCallback } from "react"
import { useErrorHandler } from "react-error-boundary"

import { GaloyClient, GaloyProvider, postRequest } from "@galoymoney/client"

import {
  AuthContext,
  AuthIdentity,
  AuthSession,
  config,
  createClient,
  storage,
} from "store/index"

const galoySessionName = "galoy-session"

const clearSession = () => {
  storage.delete(galoySessionName)
}

const persistSession = (session: AuthSession) => {
  if (session) {
    storage.set(galoySessionName, JSON.stringify(session))
  } else {
    clearSession()
  }
}

const getPersistedSession = (sessionData?: { identity?: AuthIdentity }): AuthSession => {
  if (sessionData?.identity) {
    return { identity: sessionData.identity }
  }
  if (config.isBrowser) {
    const session = storage.get(galoySessionName)

    if (session) {
      // TODO: verify session shape
      return JSON.parse(session)
    }
  }
  return null
}

type FCT = React.FC<{
  children: ReactNode
  galoyClient?: GaloyClient<unknown>
  authIdentity?: AuthIdentity
}>

export const AuthProvider: FCT = ({ children, galoyClient, authIdentity }) => {
  const [authSession, setAuthSession] = useState<AuthSession>(() =>
    getPersistedSession({ identity: authIdentity }),
  )

  const setAuth = useCallback((session: AuthSession) => {
    if (session) {
      persistSession(session)
    } else {
      clearSession()
    }

    setAuthSession(session)
  }, [])

  useEffect(() => {
    const persistedSession = getPersistedSession()

    if (
      (authIdentity?.uid || persistedSession) &&
      persistedSession?.identity?.uid !== authIdentity?.uid
    ) {
      setAuth(null)
      window.location.href = "/logout"
    }
  }, [authIdentity?.uid, setAuth])

  const handleError = useErrorHandler()
  const client = useMemo(() => {
    // When server side rendering a client is already provided
    if (galoyClient) {
      return galoyClient
    }
    return createClient({
      onError: ({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          console.debug("[GraphQL errors]:", graphQLErrors)
          // handleError(graphQLErrors[0].message)
        }
        if (networkError) {
          console.debug("[Network error]:", networkError)
          if (
            "result" in networkError &&
            networkError.result.errors?.[0]?.code === "INVALID_AUTHENTICATION"
          ) {
            postRequest("/api/logout").then(() => {
              setAuth(null)
            })
          } else {
            handleError(networkError)
          }
        }
      },
    })
  }, [galoyClient, setAuth, handleError])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(authSession?.identity),
        authIdentity: authSession?.identity,
        setAuthSession: setAuth,
      }}
    >
      <GaloyProvider client={client}>{children}</GaloyProvider>
    </AuthContext.Provider>
  )
}

export default AuthProvider
