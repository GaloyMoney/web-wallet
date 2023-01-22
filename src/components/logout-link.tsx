import {
  translate,
  useAuthContext,
  NoPropsFCT,
  config,
  ajax,
  useResetClient,
} from "store/index"

import Icon from "components/icon"

const LogoutLink: NoPropsFCT = () => {
  const { setAuthSession } = useAuthContext()

  const resetClient = useResetClient()
  const handleLogout: React.MouseEventHandler<HTMLAnchorElement> = async (event) => {
    event.preventDefault()
    ajax.get(config.galoyAuthEndpoint + "/logout").then(() => {
      resetClient()
      setAuthSession(null)
      window.location.href = "/logout"
    })
  }

  return (
    <a href="/logout" onClick={handleLogout}>
      <Icon name="logout" />
      <span className="name">{translate("Logout")}</span>
    </a>
  )
}

export default LogoutLink
