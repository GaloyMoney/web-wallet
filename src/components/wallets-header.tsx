import { formatUsd } from "@galoymoney/client"
import { SatFormat } from "@galoymoney/react"

import Link from "@/components/link"
import Icon from "@/components/icon"

import useMainQuery from "@/hooks/use-main-query"
import useMyUpdates from "@/hooks/use-my-updates"
import { NoPropsFCT } from "@/store/index"

const WalletsHeader: NoPropsFCT = () => {
  const { btcWalletBalance, usdWalletBalance, wallets } = useMainQuery()
  const { satsToUsd } = useMyUpdates()

  if (wallets.length < 2) {
    return null
  }

  return (
    <div className="wallets-header-container">
      <div className="sats">
        <div className="label">
          <div>SAT</div>
        </div>
        <div className="balances">
          {satsToUsd && (
            <div className="primary">{formatUsd(satsToUsd(btcWalletBalance))}</div>
          )}
          <div className="secondary">
            <SatFormat amount={btcWalletBalance} />
          </div>
        </div>
      </div>

      <div className="divider">
        <Link to="/convert">
          <Icon name="transfer" />
        </Link>
      </div>

      <div className="usd">
        <div className="balances">
          <div className="usd-balance">{formatUsd(usdWalletBalance)}</div>
        </div>

        <div className="label">
          <div>USD</div>
        </div>
      </div>
    </div>
  )
}

export default WalletsHeader
