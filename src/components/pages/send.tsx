import { useState } from "react"

import { GaloyGQL, PaymentType } from "@galoymoney/client"

import { translate } from "store/index"
import useMainQuery from "hooks/use-main-query"

import Header from "components/header"
import Link from "components/link"
import SendAmountLabel from "components/send/send-amount-label"
import SendConfirm from "components/send/send-confirm"
import SendDestination from "components/send/send-destination"

export type SendScreenInput = {
  view?: "destination" | "amount" | "confirm"
  fromWallet?: GaloyGQL.Wallet
  currency: "USD" | "SATS"

  // undefined in input is used to indicate their changing state
  amount?: number | ""
  destination?: string
  memo?: string

  satAmount?: number // from price conversion
  usdAmount?: number // from price conversion

  valid?: boolean // from parsing
  errorMessage?: string
  paymentType?: PaymentType

  sameNode?: boolean
  fixedAmount?: boolean // if the invoice has amount
  paymentRequest?: string // if payment is lightning
  address?: string // if payment is onchain
  recipientWalletId?: string // if payment is intraledger

  newDestination?: string // for scanned codes
}

type FCT = React.FC<{ to?: string }>

const Send: FCT = ({ to }) => {
  const { defaultWallet } = useMainQuery()

  const [input, setInput] = useState<SendScreenInput>({
    fromWallet: defaultWallet,
    view: "destination",
    currency: "USD",
    amount: "",
    destination: to ?? "",
    memo: "",
  })

  return (
    <div className="send">
      <Header page="send" />

      <div className="page-title">{translate("Send Bitcoin")}</div>

      {input.view === "destination" && (
        <SendDestination input={input} setInput={setInput} />
      )}

      {input.view === "amount" && <SendAmountLabel input={input} setInput={setInput} />}

      {input.view === "confirm" && <SendConfirm input={input} />}

      <div className="action-button center-display">
        <Link to="/">{translate("Cancel")}</Link>
      </div>
    </div>
  )
}

export default Send
