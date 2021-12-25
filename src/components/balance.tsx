import { history } from "store"
import { translate } from "translate"

const SatSymbol = () => (
  <i aria-hidden className="fak fa-satoshisymbol-solidtilt sat-symbol" />
)

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
})

const satsFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
})

const navigateToHome = () => {
  history.push("/")
}

const Balance = ({ balance }: { balance: number }) => {
  return (
    <div className="balance" onClick={navigateToHome}>
      <div className="title">{translate("CurrentBalance")}</div>
      <div className="value">
        <div className="primary">
          <SatSymbol />
          {satsFormatter.format(balance)}
        </div>
        <div className="secondary">&#8776; {usdFormatter.format(0)}</div>
      </div>
    </div>
  )
}

export default Balance
