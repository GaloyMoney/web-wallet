import { useState } from "react"

import { formatForLocale, formatUsd, truncatedDisplay } from "@galoymoney/client"
import { SatFormat } from "@galoymoney/react"

import { GaloyGQL, config, translate, getLocale } from "@/store/index"

import Icon from "@/components/icon"

export const BLOCKCHAIN_EXPLORER_URL = "https://mempool.space/tx/"

const typeDisplay = (type: GaloyGQL.SettlementVia["__typename"]) => {
  switch (type) {
    case "SettlementViaOnChain":
      return "OnChain Payment"
    case "SettlementViaLn":
      return "Lightning Payment"
    case "SettlementViaIntraLedger":
      return `${config.walletName} Payment`
  }
}

const computeUsdAmount = (tx: GaloyGQL.Transaction) => {
  const { settlementAmount, settlementPrice } = tx
  const { base, offset } = settlementPrice
  const usdPerSat = base / 10 ** offset / 100
  return settlementAmount * usdPerSat
}

const descriptionDisplay = (tx: GaloyGQL.Transaction) => {
  const { memo, direction, settlementVia } = tx
  if (memo) {
    return memo
  }

  const isReceive = direction === "RECEIVE"

  switch (settlementVia.__typename) {
    case "SettlementViaOnChain":
      return "OnChain Payment"
    case "SettlementViaLn":
      return "Lightning Payment"
    case "SettlementViaIntraLedger": {
      const counterParty =
        settlementVia.counterPartyUsername || `${config.walletName} Wallet`
      return isReceive
        ? `${translate("From")} ${counterParty}`
        : `${translate("To")} ${counterParty}`
    }
  }
}

const { formatTime, formatRelativeTime } = formatForLocale(getLocale())

type FCT = React.FC<{ tx: GaloyGQL.Transaction }>

const TransactionItem: FCT = ({ tx }) => {
  const [showDetails, setShowDetails] = useState(false)

  const isReceive = tx.direction === "RECEIVE"
  const isPending = tx.status === "PENDING"
  const description = descriptionDisplay(tx)
  const usdAmount = computeUsdAmount(tx)

  const handleOnClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    setShowDetails(!showDetails)
  }

  const txIcon = <Icon name={isReceive ? "receive" : "send"} />

  if (showDetails) {
    return (
      <div
        className={`transaction-item pending-${isPending} direction-${tx.direction.toLocaleLowerCase()}`}
      >
        <div className="transaction-summary" onClick={handleOnClick}>
          <div className="icon">{txIcon}</div>

          <div className="content">
            <div className="description">{typeDisplay(tx.settlementVia.__typename)}</div>
            <div className="date">{formatTime(tx.createdAt)}</div>
          </div>

          <div className="amount">
            {tx.settlementCurrency === "USD" ? (
              <div className="usd-primary">{formatUsd(tx.settlementAmount / 100)}</div>
            ) : (
              <div>
                <SatFormat amount={tx.settlementAmount} />
                <div className="amount-seconddary">{formatUsd(usdAmount)}</div>
              </div>
            )}
          </div>
        </div>

        <div className={`transaction-details pending_${isPending}`}>
          <div>
            <div className="label">{translate("Description")}</div>
            <div className="value">{description}</div>
          </div>

          {!isReceive && (
            <div>
              <div className="label">{translate("Fee")}</div>
              <div className="value">
                <SatFormat amount={tx.settlementFee} />
              </div>
            </div>
          )}

          {tx.settlementVia.__typename === "SettlementViaIntraLedger" && (
            <div>
              <div className="label">
                {translate(isReceive ? "Received from" : "Sent to")}
              </div>
              <div className="value">
                {tx.settlementVia.counterPartyUsername || `${config.walletName} Wallet`}
              </div>
            </div>
          )}

          {tx.settlementVia.__typename === "SettlementViaLn" && (
            <div>
              <div className="label">{translate("Hash")}</div>
              <div className="value">
                {(tx.initiationVia as GaloyGQL.InitiationViaLn).paymentHash}
              </div>
            </div>
          )}

          {tx.settlementVia.__typename === "SettlementViaOnChain" && (
            <div>
              <div className="label">{translate("Hash")}</div>
              <div className="value">
                <a
                  href={`${BLOCKCHAIN_EXPLORER_URL}${tx.settlementVia.transactionHash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {tx.settlementVia.transactionHash}
                </a>
              </div>
            </div>
          )}

          {tx.id && (
            <div>
              <div className="label">ID</div>
              <div className="value">{tx.id}</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`transaction-item pending-${isPending} direction-${tx.direction.toLocaleLowerCase()}`}
    >
      <div className="transaction-summary" onClick={handleOnClick}>
        <div className="icon">{txIcon}</div>

        <div className="content">
          <div className="description">{truncatedDisplay(description ?? "")}</div>
          <div className="date">{formatRelativeTime(tx.createdAt)}</div>
        </div>

        <div className="amount">
          {tx.settlementCurrency === "USD" ? (
            <div className="usd-primary">{formatUsd(tx.settlementAmount / 100)}</div>
          ) : (
            <div>
              <SatFormat amount={tx.settlementAmount} />
              <div className="amount-seconddary">{formatUsd(usdAmount)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionItem
