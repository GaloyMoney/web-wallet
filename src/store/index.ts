import { createContext } from "react"

const GwwContext = createContext<GwwContextType>({
  state: { path: "/" },
  dispatch: (_action: GwwAction) => {
    // Do nothing
  },
})

export default GwwContext
