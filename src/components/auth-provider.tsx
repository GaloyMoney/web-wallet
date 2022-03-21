import React, { useMemo, useState, ReactNode, useEffect, useCallback } from "react"
import { useErrorHandler } from "react-error-boundary"

import { GaloyClient, GaloyProvider, postRequest } from "@galoymoney/client"

import { createClient, useAppDispatcher, useRequest } from "store/index"
import { getPersistedSession, persistSession, clearSession } from "store/auth-session"
import { AuthContext } from "store/use-auth-context"
import config from "store/config"
import axios from "axios"

type FCT = React.FC<{
  children: ReactNode
  galoyClient?: GaloyClient<unknown>
  galoyJwtToken?: string
  sessionUserId?: string
}>

export const AuthProvider: FCT = ({
  children,
  galoyClient,
  galoyJwtToken,
  sessionUserId,
}) => {
  const request = useRequest()
  const dispatch = useAppDispatcher()
  const [authSession, setAuthSession] = useState<AuthSession>(() =>
    getPersistedSession(galoyJwtToken),
  )

  const setAuth = useCallback((session: AuthSession) => {
    if (session) {
      persistSession(session)
    } else {
      clearSession()
    }

    setAuthSession(session)
  }, [])

  const syncSession = useCallback(async () => {
    const resp = await axios.post(config.galoyAuthEndpoint, {}, { withCredentials: true })
    if (!resp.data.authToken) {
      throw new Error("Invalid auth token respose")
    }
    const authToken = resp.data.authToken
    const session = await request.post(config.authEndpoint, { authToken })
    if (!session || !session.galoyJwtToken) {
      throw new Error("Invalid auth token respose")
    }
    setAuth(session.galoyJwtToken ? session : null)
    dispatch({ type: "kratos-login", sessionUserId: session.identity.userId })
  }, [dispatch, request, setAuth])

  useEffect(() => {
    const persistedSession = getPersistedSession()

    if (
      (sessionUserId || persistedSession) &&
      persistedSession?.identity?.userId !== sessionUserId
    ) {
      setAuth(null)
      document.location.href = "/logout"
    }
  }, [sessionUserId, setAuth])

  const handleError = useErrorHandler()
  const client = useMemo(() => {
    // When server side rendering a client is already provided
    if (galoyClient) {
      return galoyClient
    }
    return createClient({
      authToken: authSession?.galoyJwtToken,
      onError: ({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          console.debug("[GraphQL errors]:", graphQLErrors)
        }
        if (networkError) {
          console.debug("[Network error]:", networkError)
          if (
            "result" in networkError &&
            networkError.result.errors?.[0]?.code === "INVALID_AUTHENTICATION"
          ) {
            postRequest(authSession?.galoyJwtToken)("/api/logout").then(() => {
              setAuth(null)
            })
          } else {
            handleError(networkError)
          }
        }
      },
    })
  }, [galoyClient, authSession?.galoyJwtToken, setAuth, handleError])

  return (
    <AuthContext.Provider
      value={{
        galoyJwtToken: authSession?.galoyJwtToken,
        isAuthenticated: Boolean(authSession?.galoyJwtToken),
        setAuthSession: setAuth,
        syncSession,
      }}
    >
      <GaloyProvider client={client}>{children}</GaloyProvider>
    </AuthContext.Provider>
  )
}

export default AuthProvider
