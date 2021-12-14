import { useContext, useReducer } from "react"

import GwwContext from "../context"

import appRoutes, { SupportedRoutes } from "server/routes"

const Root = () => {
  const { state } = useContext<GwwContextType>(GwwContext)
  if (!state.rootComponentPath) {
    return null
  }

  const checkedRoutePath = SupportedRoutes.find(
    (supportedRoute) => supportedRoute === state.rootComponentPath,
  )

  if (!checkedRoutePath) {
    throw new Error("Invaild Route")
  }

  const Component = appRoutes[checkedRoutePath].component
  return (
    <>
      <Component />
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
  switch (action.type) {
    case "navigateTo":
      return { ...state, rootComponentPath: action.path }
    default:
      throw new Error()
  }
}

const RootProvider = ({ initialData }: { initialData: InitialData }) => {
  const [state, dispatch] = useReducer(wwReducer, { rootComponentPath: initialData.path })

  return (
    <GwwContext.Provider value={{ state, dispatch }}>
      <Root />
    </GwwContext.Provider>
  )
}

export default RootProvider
