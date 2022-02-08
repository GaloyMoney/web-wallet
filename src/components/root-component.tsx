import { Suspense, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { Spinner } from "@galoymoney/react"

import appRoutes, { SupportedRoutes } from "../server/routes"

import { history, useAppDispatcher } from "../store"
import { useAuthContext } from "../store/use-auth-context"

import ErrorFallback from "./error-fallback"

type Props = { path: RoutePath }

const RootComponent = ({ path }: Props) => {
  const dispatch = useAppDispatcher()
  const { isAuthenticated } = useAuthContext()

  useEffect(() => {
    const unlisten = history.listen(({ location }) => {
      dispatch({
        type: "update",
        path: location.pathname,
        ...(location.state as Record<string, unknown> | null),
      })
    })
    return () => unlisten()
  }, [isAuthenticated, dispatch])

  const checkedRoutePath = SupportedRoutes.find(
    (supportedRoute) => supportedRoute === path,
  )
  if (!checkedRoutePath) {
    throw new Error("INVALID_ROOT_PATH")
  }

  const Component = appRoutes[checkedRoutePath].component
  return (
    <Suspense
      fallback={
        <div className="suspense-fallback">
          <Spinner size="big" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div id="main-container">
          <Component />
        </div>
      </ErrorBoundary>
    </Suspense>
  )
}

export default RootComponent
