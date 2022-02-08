import { useEffect, useReducer } from "react"

import { GaloyClient, setLocale } from "@galoymoney/client"

import { GwwContext, history } from "../store"
import mainReducer from "../store/reducer"

import { AuthProvider } from "../components/auth-provider"
import RootComponent from "../components/root-component"

type RootProps = { GwwState: GwwState }

const Root = ({ GwwState }: RootProps) => {
  const [state, dispatch] = useReducer(mainReducer, GwwState, (initState) => {
    setLocale(initState.defaultLanguage)
    return initState
  })

  useEffect(() => {
    const unlisten = history.listen(({ location }) => {
      dispatch({
        type: "update",
        path: location.pathname,
        ...(location.state as Record<string, unknown> | null),
      })
    })
    return () => unlisten()
  }, [state?.authToken])

  return (
    <AuthProvider authToken={state?.authToken}>
      <GwwContext.Provider value={{ state, dispatch }}>
        <RootComponent path={state.path} key={state.key} />
      </GwwContext.Provider>
    </AuthProvider>
  )
}

type SSRootProps = {
  client: GaloyClient<unknown>
  GwwState: GwwState
}

export const SSRRoot = ({ client, GwwState }: SSRootProps) => {
  const [state, dispatch] = useReducer(mainReducer, GwwState, (initState) => {
    setLocale(initState.defaultLanguage)
    return initState
  })

  return (
    <AuthProvider galoyClient={client}>
      <GwwContext.Provider value={{ state, dispatch }}>
        <RootComponent path={state.path} />
      </GwwContext.Provider>
    </AuthProvider>
  )
}

export default Root
