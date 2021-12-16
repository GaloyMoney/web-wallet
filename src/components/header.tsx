import Balance from "./balance"
import Link from "./link"

const Header = ({ balance }: { balance: number }) => {
  return (
    <div className="header">
      <Balance balance={balance} />
      <Link to="/login">Login</Link>
    </div>
  )
}

export default Header
