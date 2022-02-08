import { useReducer } from "react"

import { GaloyClient, setLocale } from "@galoymoney/client"

import { GwwContext} from "../store"
import mainReducer from "../store/reducer"

import { AuthProvider } from "../components/auth-provider"
import RootComponent from "../components/root-component"

type RootProps = { GwwState: GwwState }

const Root = ({ GwwState }: RootProps) => {
  const [state, dispatch] = useReducer(mainReducer, GwwState, (initState) => {
    setLocale(initState.defaultLanguage)
    return initState
  })

  return (
    <AuthProvider>
      <GwwContext.Provider value={{ state, dispatch }}>
        <RootComponent path={state.path} key={state.key} />
      </GwwContext.Provider>
    </AuthProvider>
  )
}

type SSRootProps = {
  client: GaloyClient<unknown>
  authToken?: string
  GwwState: GwwState
}

export const SSRRoot = ({ client, GwwState, authToken }: SSRootProps) => {
  const [state, dispatch] = useReducer(mainReducer, GwwState, (initState) => {
    setLocale(initState.defaultLanguage)
    return initState
  })

  return (
    <AuthProvider galoyClient={client} authToken={authToken}>
      <GwwContext.Provider value={{ state, dispatch }}>
        <RootComponent path={state.path} />
      </GwwContext.Provider>
    </AuthProvider>
  )
}

export default Root
