import { createClient, Provider } from "urql"
import { useContext, useEffect, useReducer } from "react"

import GwwContext from "../store"
import history from "store/history"
import appRoutes, { SupportedRoutes } from "server/routes"

const Root = () => {
  const { state } = useContext<GwwContextType>(GwwContext)
  if (!state.path) {
    return null
  }

  const checkedRoutePath = SupportedRoutes.find(
    (supportedRoute) => supportedRoute === state.path,
  )

  if (!checkedRoutePath) {
    throw new Error("Invaild Route")
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
    case "navigateTo":
      return { ...state, ...newState }
    default:
      throw new Error()
  }
}

const RootProvider = ({ initialState }: { initialState: InitialState }) => {
  const [state, dispatch] = useReducer(wwReducer, initialState)

  useEffect(() => {
    const unlisten = history.listen(({ location }) => {
      dispatch({ type: "navigateTo", path: location.pathname, ...location.state })
    })
    return () => unlisten()
  }, [])

  const client = createClient({
    url: "http://localhost:4002/graphql",
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
