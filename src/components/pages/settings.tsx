import { translate } from "@galoymoney/client"
import { useAuthContext } from "../../store/use-auth-context"

import Header from "../header"
import ColorThemeSetting from "../settings/color-theme"
import LanguageSetting from "../settings/language"
import UsernameSetting from "../settings/username"

const Settings: NoPropsFCT = () => {
  const { isAuthenticated } = useAuthContext()

  return (
    <div className="settings">
      <Header page="settings" />
      <div className="page-title">{translate("Settings")}</div>

      <div className="list">
        <UsernameSetting guestView={!isAuthenticated} />
        <LanguageSetting guestView={!isAuthenticated} />
        <ColorThemeSetting />
      </div>
    </div>
  )
}

export default Settings
