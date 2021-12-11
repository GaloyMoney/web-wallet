type RoutePath = typeof import("../server/server").SupportedRoutes[number]
type RouteInfo = Record<string, string | (() => JSX.Element)>
type AppRoutes = Record<RoutePath, RouteInfo>

type InitialData = {
  path: RoutePath
  appRoutes: AppRoutes
}

declare interface Window {
  __G_DATA: {
    initialData: InitialData
  }
}

type ServerRendererFunction = (path: RoutePath) => Promise<{
  initialData: InitialData
  initialMarkup: string
  pageData: RouteInfo
}>
