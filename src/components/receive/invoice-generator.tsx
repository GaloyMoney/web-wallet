import { useState, useEffect, useRef } from "react"

import { formatUsd, GaloyGQL, useMutation } from "@galoymoney/client"
import { SatFormat, Spinner } from "@galoymoney/react"

import { translate } from "store/index"

import { LightningInvoice, OnChainInvoice } from "components/receive/invoice-details"
import ErrorMessage from "components/error-message"

const INVOICE_EXPIRE_INTERVAL = 60 * 60 * 1000

type ExpiredMessageFCT = React.FC<{ onClick: () => void }>

const ExpiredMessage: ExpiredMessageFCT = ({ onClick }) => (
  <div className="invoice-message expired-invoice">
    {translate("Invoice Expired")}{" "}
    <div className="link" onClick={onClick}>
      {translate("Generate New Invoice")}
    </div>
  </div>
)

type AmountInvoiceFCT = React.FC<{
  layer: "lightning" | "onchain"
  btcWalletId: string
  btcAddress: GaloyGQL.Scalars["OnChainAddress"] | undefined
  regenerate: () => void
  amount: number | ""
  currency: string
  memo: string
  satAmount: number
  usdAmount: number
}>

const AmountInvoiceGenerator: AmountInvoiceFCT = ({
  btcWalletId,
  regenerate,
  amount,
  memo,
  currency,
  satAmount,
  usdAmount,
}) => {
  const [invoiceStatus, setInvoiceStatus] = useState<undefined | "new" | "expired">()

  const timerIds = useRef<number[]>([])

  const [createInvoice, { loading, errorsMessage, data }] = useMutation.lnInvoiceCreate({
    onCompleted: () => setInvoiceStatus("new"),
  })

  const clearTimers = () => {
    timerIds.current.forEach((timerId) => clearTimeout(timerId))
  }

  useEffect(() => {
    createInvoice({
      variables: { input: { walletId: btcWalletId, amount: satAmount, memo } },
    })
    timerIds.current.push(
      window.setTimeout(() => setInvoiceStatus("expired"), INVOICE_EXPIRE_INTERVAL),
    )
    return clearTimers
  }, [satAmount, btcWalletId, createInvoice, currency, memo])

  if (errorsMessage) {
    return <ErrorMessage message={errorsMessage} />
  }

  if (loading) {
    return <Spinner size="big" />
  }

  const invoice = data?.lnInvoiceCreate?.invoice

  if (!invoice) {
    return null
  }

  if (invoiceStatus === "expired") {
    return <ExpiredMessage onClick={regenerate} />
  }

  const invoiceNeedUpdate = Boolean(
    currency === "USD" && amount && Math.abs(usdAmount - amount) / amount > 0.01,
  )

  return (
    <>
      {invoiceNeedUpdate && (
        <div className="invoice-message">
          {translate("Invoice value is now %{value}", {
            value: formatUsd(usdAmount),
          })}
          <div className="link" onClick={regenerate}>
            {translate("Generate new invoice for %{amount}", {
              amount: formatUsd(amount as number),
            })}
          </div>
        </div>
      )}
      <LightningInvoice invoice={invoice} onPaymentSuccess={clearTimers} />
      <div className="amount-description">
        <div className="converted-sats">
          <SatFormat amount={satAmount} />
        </div>
        <div className="converted-usd small">&#8776; {formatUsd(usdAmount)}</div>
      </div>
    </>
  )
}

type NoAmountInvoiceFCT = React.FC<{
  btcWalletId: string
  regenerate: () => void
  memo: string
}>

const NoAmountInvoiceGenerator: NoAmountInvoiceFCT = ({
  btcWalletId,
  regenerate,
  memo,
}) => {
  const [invoiceStatus, setInvoiceStatus] = useState<undefined | "new" | "expired">()

  const timerIds = useRef<number[]>([])

  const [createInvoice, { loading, errorsMessage, data }] =
    useMutation.lnNoAmountInvoiceCreate({
      onCompleted: () => setInvoiceStatus("new"),
    })

  const clearTimers = () => {
    timerIds.current.forEach((timerId) => clearTimeout(timerId))
  }

  useEffect(() => {
    createInvoice({
      variables: { input: { walletId: btcWalletId, memo } },
    })
    timerIds.current.push(
      window.setTimeout(() => setInvoiceStatus("expired"), INVOICE_EXPIRE_INTERVAL),
    )
    return clearTimers
  }, [btcWalletId, createInvoice, memo])

  if (errorsMessage) {
    return <ErrorMessage message={errorsMessage} />
  }

  if (loading) {
    return <Spinner size="big" />
  }

  const invoice = data?.lnNoAmountInvoiceCreate?.invoice

  if (!invoice) {
    return null
  }

  if (invoiceStatus === "expired") {
    return <ExpiredMessage onClick={regenerate} />
  }

  return (
    <>
      <LightningInvoice invoice={invoice} onPaymentSuccess={clearTimers} />
      <div className="amount-description">Flexible Amount Invoice</div>
    </>
  )
}

const InvoiceGenerator: AmountInvoiceFCT = (props) => {
  if (props.layer === "onchain" && props.btcAddress) {
    return (
      <OnChainInvoice
        btcAddress={props.btcAddress}
        satAmount={props.satAmount}
        usdAmount={props.usdAmount}
        memo={props.memo}
      />
    )
  }

  if (props.satAmount === 0) {
    return (
      <NoAmountInvoiceGenerator
        btcWalletId={props.btcWalletId}
        regenerate={props.regenerate}
        memo={props.memo}
      />
    )
  }

  return <AmountInvoiceGenerator {...props} />
}

export default InvoiceGenerator
