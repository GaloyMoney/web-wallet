import React, { useMemo, useState, ReactNode } from "react"
import { useErrorHandler } from "react-error-boundary"

import { GaloyClient, GaloyProvider, postRequest } from "@galoymoney/client"

import { createClient } from "store/index"
import { getPersistedSession, persistSession, clearSession } from "store/auth-session"
import { AuthContext } from "store/use-auth-context"

type FCT = React.FC<{
  children: ReactNode
  galoyClient?: GaloyClient<unknown>
  galoyJwtToken?: string
  kratosSessionToken?: string
}>

export const AuthProvider: FCT = ({
  children,
  galoyClient,
  galoyJwtToken,
  kratosSessionToken,
}) => {
  // kratos.whoAmI();

  const [authSession, setAuthSession] = useState<AuthSession>(() =>
    getPersistedSession(galoyJwtToken, kratosSessionToken),
  )

  const setAuth = (session: AuthSession) => {
    if (session) {
      persistSession(session)
    } else {
      clearSession()
    }

    setAuthSession(session)
  }

  const handleError = useErrorHandler()
  const client = useMemo(() => {
    // When server side rendering a client is already provided
    if (galoyClient) {
      return galoyClient
    }
    return createClient({
      authToken: authSession?.galoyJwtToken || authSession?.kratosSessionToken,
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
  }, [handleError, galoyClient, authSession])

  return (
    <AuthContext.Provider
      value={{
        galoyJwtToken: authSession?.galoyJwtToken,
        isAuthenticated: Boolean(
          authSession?.galoyJwtToken || authSession?.kratosSessionToken,
        ),
        setAuthSession: setAuth,
      }}
    >
      <GaloyProvider client={client}>{children}</GaloyProvider>
    </AuthContext.Provider>
  )
}

export default AuthProvider
