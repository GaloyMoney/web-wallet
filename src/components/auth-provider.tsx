import React, {
  useMemo,
  createContext,
  ReactNode,
} from 'react'
import { useErrorHandler } from "react-error-boundary"

import { GaloyClient, GaloyProvider, postRequest } from "@galoymoney/client"
import { createClient } from "../store"

interface Context {
  galoyJwtToken?: string
}

export const AuthContext = createContext<Context>({})

interface AuthContextProps {
  children: ReactNode
  galoyClient?: GaloyClient<unknown>
  authToken?: string
}

export const AuthProvider = ({ children, galoyClient, authToken }: AuthContextProps) => {
  const handleError = useErrorHandler()
  const client = useMemo(
    () => {
      // When server side rendering a client is already provided
      if (galoyClient) {
        return galoyClient
      }
      return createClient({
        authToken,
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
              postRequest(authToken)("/api/logout").then(
                () => (document.location = "/"),
              )
            } else {
              handleError(networkError)
            }
          }
        },
      })
    },
    [handleError, galoyClient, authToken],
  )
  
  return (
    <AuthContext.Provider value={{
      }}>
      <GaloyProvider client={client}>
        {children}
      </GaloyProvider>
    </AuthContext.Provider>
  )
}

export default AuthProvider
