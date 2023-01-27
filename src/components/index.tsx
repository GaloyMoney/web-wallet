import { ErrorBoundary } from "react-error-boundary"

import Root from "@/components/root"
import ErrorFallback from "@/components/error-fallback"
import { ValidPath } from "@/server/routes"

import { setColorThemeFromStorage } from "@/store/index"

setColorThemeFromStorage()

const initialState = {
  key: 0,
  path: "/" as ValidPath,
}

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Root GwwState={initialState} />
    </ErrorBoundary>
  )
}

export default App
