import { translate } from "@galoymoney/client"

import Header from "../header"
import ColorThemeSetting from "./color-theme"
import LanguageSetting from "./language"
import UsernameSetting from "./username"

const Settings = () => {
  return (
    <div className="settings">
      <Header page="settings" />
      <div className="page-title">{translate("Settings")}</div>

      <div className="list">
        <UsernameSetting />
        <LanguageSetting />
        <ColorThemeSetting />
      </div>
    </div>
  )
}

export default Settings
