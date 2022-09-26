import { MouseEvent } from "react"

import { formatUsd, GaloyGQL } from "@galoymoney/client"
import { SatFormat, Spinner, SuccessCheckmark } from "@galoymoney/react"
import { Span } from "@opentelemetry/api"

import { translate } from "store/index"
import { getTracer, withTracing } from "store/client-tracing/tracing"

import useMyUpdates from "hooks/use-my-updates"

type FeeDisplayFCT = React.FC<{ satAmount: number | undefined }>

const FeeDisplay: FeeDisplayFCT = ({ satAmount }) => {
  const { satsToUsd } = useMyUpdates()
  if (satAmount === undefined) {
    return null
  }
  return (
    <div className="fee-amount">
      <div className="label">Fee</div>
      <div className="content">
        <SatFormat amount={satAmount} />
        {satsToUsd && satAmount > 0 && (
          <div className="fee-usd-amount small">
            &#8776; {formatUsd(satsToUsd(satAmount))}
          </div>
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
  feeSatAmount: number | undefined
  reset: () => void
  handleSend: (event: MouseEvent<HTMLButtonElement>) => void
}>

const SendActionDisplay: SendActionDisplayFCT = ({
  loading,
  error,
  data,
  feeSatAmount,
  reset,
  handleSend,
}) => {
  const recordErrors = (sendError: string, span: Span) => {
    span.setAttribute("Error sending payment", sendError)
    withTracing("send bitcoin error", span)
  }

  if (error) {
    if (typeof error === "string") {
      const tracer = getTracer()
      const span = tracer.startSpan("web wallet error")
      recordErrors(error, span)
    }
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
      {feeSatAmount !== undefined && <FeeDisplay satAmount={feeSatAmount} />}
      <button onClick={handleSend} disabled={loading}>
        {translate("Send Payment")} {loading && <Spinner size="small" />}
      </button>
    </>
  )
}

export default SendActionDisplay
