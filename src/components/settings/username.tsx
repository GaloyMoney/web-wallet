import { translate } from "@galoymoney/client"
import { Icon } from "@galoymoney/react"

import useMainQuery from "../../hooks/use-main-query"

const UsernameSetting = () => {
  const { username } = useMainQuery()

  return (
    <div className="setting">
      <div className="icon">
        <Icon name="person" />
      </div>
      <div className="name">
        {translate("Username")}
        <div className="sub">{username}</div>
      </div>
      <div className="action">
        <Icon name="lock" />
      </div>
    </div>
  )
}

export default UsernameSetting
