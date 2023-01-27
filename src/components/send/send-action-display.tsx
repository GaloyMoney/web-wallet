import { MouseEvent } from "react"

import { formatUsd } from "@galoymoney/client"
import { SatFormat, Spinner, SuccessCheckmark } from "@galoymoney/react"

import { GaloyGQL, translate } from "@/store/index"

import useMyUpdates from "@/hooks/use-my-updates"

type FeeAmount = {
  amount: number | undefined
  currency: "CENTS" | "SATS"
}

type FeeDisplayFCT = React.FC<{ amount: FeeAmount | undefined }>

const FeeDisplay: FeeDisplayFCT = ({ amount }) => {
  const { satsToUsd } = useMyUpdates()
  if (amount?.amount === undefined) {
    return null
  }
  return (
    <div className="fee-amount">
      <div className="label">Fee</div>
      <div className="content">
        {amount.currency === "SATS" ? (
          <>
            <SatFormat amount={amount.amount} />
            {satsToUsd && amount.amount > 0 && (
              <div className="fee-usd-amount small">
                &#8776; {formatUsd(satsToUsd(amount.amount))}
              </div>
            )}
          </>
        ) : (
          <div>{formatUsd(amount.amount / 100)}</div>
        )}
      </div>
    </div>
  )
}

type StatusDisplayFCT = React.FC<{ status: GaloyGQL.PaymentSendResult }>

const StatusDisplay: StatusDisplayFCT = ({ status }) => {
  switch (status) {
    case "ALREADY_PAID":
      return <div className="error">{translate("Invoice is already paid")}</div>
    case "SUCCESS":
      return <SuccessCheckmark />
    default:
      return <div className="error">{translate("Payment failed")}</div>
  }
}

type SendActionDisplayFCT = React.FC<{
  loading: boolean
  error: string | undefined
  data: GaloyGQL.PaymentSendPayload | undefined
  feeAmount: FeeAmount | undefined
  reset: () => void
  handleSend: (event: MouseEvent<HTMLButtonElement>) => void
}>

const SendActionDisplay: SendActionDisplayFCT = ({
  loading,
  error,
  data,
  feeAmount,
  reset,
  handleSend,
}) => {
  if (error) {
    return <div className="error">{error}</div>
  }

  if (data?.status) {
    return (
      <div className="invoice-status">
        <StatusDisplay status={data.status} />
        <button onClick={reset}>{translate("Send another payment")}</button>
      </div>
    )
  }

  return (
    <>
      {feeAmount !== undefined && <FeeDisplay amount={feeAmount} />}
      <button onClick={handleSend} disabled={loading}>
        {translate("Send Payment")} {loading && <Spinner size="small" />}
      </button>
    </>
  )
}

export default SendActionDisplay
