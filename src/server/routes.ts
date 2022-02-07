import Home from "../components/pages/home"
import Login from "../components/pages/login"
import Send from "../components/pages/send"
import Receive from "../components/pages/receive"
import Contacts from "../components/contacts"

// Note: The component property is skipped by the serialize function
// It's only used on the front-end
const appRoutes = {
  "/": {
    component: Home,
    title: "Galoy Web Wallet",
  },
  "/login": {
    component: Login,
    title: "Login to Galoy Web Wallet",
  },
  "/send": {
    component: Send,
    title: "Send Bitcoin",
  },
  "/scan": {
    component: Send,
    title: "Send Bitcoin",
  },
  "/receive": {
    component: Receive,
    title: "Receive Bitcoin",
  },
  "/contacts": {
    component: Contacts,
    title: "Contacts",
  },
}

export type SupportedRoutes = keyof typeof appRoutes

export const checkRoute = (path: string): RoutePath | Error => {
  if (appRoutes[path as never]) {
    return path as RoutePath
  }
  return new Error("Invaild route path")
}

export default appRoutes
