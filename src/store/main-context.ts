import { createContext, useContext } from "react"
import { config as storeConfig } from "store/config"
import { GwwActionType, GwwContextType } from "store/index"
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
  from,
  NormalizedCacheObject,
} from "@apollo/client"
import { ErrorLink, onError } from "@apollo/client/link/error"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"

import { createClient as createWsClient } from "graphql-ws"
import { getMainDefinition } from "@apollo/client/utilities"

const defaultErrorCallback: ErrorLink.ErrorHandler = ({
  graphQLErrors,
  networkError,
}) => {
  if (graphQLErrors) {
    console.debug("[GraphQL errors]:", graphQLErrors)
  }
  if (networkError) {
    console.debug("[Network error]:", networkError)
  }
}

export type CreateGaloyClientFunction = (argW: {
  config: Record<string, any>
  initData?: NormalizedCacheObject
}) => (arg?: {
  authToken?: string
  headers?: Record<string, string | Array<string> | undefined>
  onError?: ErrorLink.ErrorHandler
}) => ApolloClient<NormalizedCacheObject>

export const createGaloyClient: CreateGaloyClientFunction =
  ({ config, initData }) =>
  ({ authToken, onError: onErrorCallback } = {}) => {
    const cache = initData ? new InMemoryCache().restore(initData) : new InMemoryCache()
    const errorLink = onError(onErrorCallback ?? defaultErrorCallback)

    const authLink = new ApolloLink((operation, forward) => {
      operation.setContext(({ headers }: { headers: Record<string, string> }) => ({
        headers: {
          authorization: authToken ? `Bearer ${authToken}` : "",
          ...headers,
          Cookie: document.cookie,
        },
      }))
      return forward(operation)
    })

    const httpLink = new HttpLink({ uri: config.graphqlUrl, credentials: "include" })

    const wsLink = new GraphQLWsLink(
      createWsClient({
        url: config.graphqlSubscriptionUrl,
        retryAttempts: 3,
        lazy: true,
        connectionParams: async () => {
          return {
            credentials: "include",
          }
        },
        shouldRetry: (errOrCloseEvent) => {
          console.warn({ errOrCloseEvent }, "entering shouldRetry function for websocket")
          return true
        },
      }),
    )

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        )
      },
      wsLink,
      from([errorLink, authLink, httpLink]),
    )

    return new ApolloClient({
      cache,
      link: splitLink,
    })
  }

export const GwwContext = createContext<GwwContextType>({
  state: { key: 0, path: "/" },
  dispatch: (_action: GwwActionType) => {
    // Do nothing
  },
})

export const useAppState = () => {
  const { state } = useContext<GwwContextType>(GwwContext)
  return state
}

export const useAppDispatcher = () => {
  const { dispatch } = useContext<GwwContextType>(GwwContext)
  return dispatch
}

export const createClient = createGaloyClient({ config: storeConfig })
