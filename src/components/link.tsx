import appRoutes from "server/routes"

type Props = {
  to: RoutePath
  children: React.ReactNode
}

const Link = ({ to, children }: Props) => {
  const navigate: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (!event.ctrlKey && !event.metaKey) {
      event.preventDefault()
    }
    const routeInfo = appRoutes[to]
    console.info(routeInfo)
  }
  return (
    <a href={to} onClick={navigate}>
      {children}
    </a>
  )
}

export default Link
