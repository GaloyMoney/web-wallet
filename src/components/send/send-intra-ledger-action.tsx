import { useMutation } from "@galoymoney/client"
import React, { MouseEvent } from "react"

import SendActionDisplay from "components/send/send-action-display"
import { SendActionProps } from "components/send/send-action"
import { getTracer, withTracing, reportSpan } from "store/client-tracing/tracing"

const tracer = getTracer()

export type SendIntraLedgerActionProps = SendActionProps & {
  recipientWalletId: string
  satAmount: number
}

type FCT = React.FC<SendIntraLedgerActionProps>

const SendIntraLedgerAction: FCT = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parentSpan, setParentSpan] = React.useState<any>(null)
  const [sendPayment, { loading, errorsMessage, data }] =
    useMutation.intraLedgerPaymentSend()

  const handleSend = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const rootSpan = tracer.startSpan("web wallet")
    await withTracing("intra-ledger send", rootSpan, async () => {
      sendPayment({
        variables: {
          input: {
            walletId: props.btcWalletId,
            recipientWalletId: props.recipientWalletId,
            amount: props.satAmount,
            memo: props.memo,
          },
        },
      })
    })
    setParentSpan(rootSpan)
  }

  React.useEffect(() => {
    if (parentSpan) {
      parentSpan.end()
      reportSpan(parentSpan)
    }
  }, [parentSpan])

  return (
    <SendActionDisplay
      loading={loading}
      error={errorsMessage}
      data={data?.intraLedgerPaymentSend}
      feeSatAmount={0}
      reset={props.reset}
      handleSend={handleSend}
    />
  )
}

export default SendIntraLedgerAction
