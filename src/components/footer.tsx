import { Icon } from "components/icon"

import { useAuthContext } from "store/index"

import Link from "components/link"

type Page = "home" | "settings" | "transactions"

type FCT = React.FC<{ page?: Page }>

const Footer: FCT = ({ page }) => {
  const { isAuthenticated } = useAuthContext()
  return (
    <div className={`footer ${page}-footer`}>
      <div className="nav-icons">
        <div className="tab">
          <Link to="/">
            <Icon name="home" />
          </Link>
        </div>
        <div className="tab">
          <Link to="/transactions">
            <Icon name="clock" />
          </Link>
        </div>
        <div className="tab disabled">
          <Icon name="bitcoin" />
        </div>
        <div className="tab disabled">
          <Link to={isAuthenticated ? "/settings" : "/login"}>
            <Icon name="person" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
