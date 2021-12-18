import { createClient, Provider } from "urql"
import { useEffect, useReducer } from "react"

import { GwwContext, history, useAppState } from "store"
import appRoutes, { SupportedRoutes } from "server/routes"
import config from "server/config"

const Root = () => {
  const { state } = useAppState()
  if (!state.path) {
    return null
  }

  const checkedRoutePath = SupportedRoutes.find(
    (supportedRoute) => supportedRoute === state.path,
  )

  if (!checkedRoutePath) {
    throw new Error("INVALID_ROUTE")
  }

  const Component = appRoutes[checkedRoutePath].component
  return (
    <>
      <div className="main-container">
        <Component />
      </div>
      <div className="footer">
        <div className="powered-by">
          Powerd By{" "}
          <a href="https://galoy.io/" target="_blank" rel="noreferrer">
            Galoy
          </a>
        </div>
      </div>
    </>
  )
}

const wwReducer = (state: GwwState, action: GwwAction): GwwState => {
  const { type, ...newState } = action

  switch (type) {
    case "state":
      return { ...state, ...newState }
    case "logout":
      return { ...state, authToken: undefined }
    default:
      throw new Error("UNSUPPORTED_ACTION")
  }
}

const RootProvider = ({ initialState }: { initialState: InitialState }) => {
  const [state, dispatch] = useReducer(wwReducer, initialState)

  useEffect(() => {
    const unlisten = history.listen(({ location }) => {
      dispatch({ type: "state", path: location.pathname, ...location.state })
    })
    return () => unlisten()
  }, [])

  const client = createClient({
    url: config.graphqlUri,
    fetchOptions: () => {
      const token = state.authToken
      return {
        headers: { authorization: token ? `Bearer ${token}` : "" },
      }
    },
  })

  return (
    <Provider value={client}>
      <GwwContext.Provider value={{ state, dispatch }}>
        <Root />
      </GwwContext.Provider>
    </Provider>
  )
}

export default RootProvider
