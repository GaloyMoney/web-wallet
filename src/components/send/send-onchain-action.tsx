import { useMutation, useQuery } from "@galoymoney/client"
import React, { MouseEvent } from "react"

import SendActionDisplay from "components/send/send-action-display"
import { SendActionProps } from "components/send/send-action"
import { getTracer, reportSpan, withTracing } from "store/client-tracing/tracing"

const tracer = getTracer()

export type SendOnChainActionProps = SendActionProps & {
  address: string
  satAmount: number
}

type FCT = React.FC<SendOnChainActionProps>

const SendOnChainAction: FCT = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parentSpan, setParentSpan] = React.useState<any>(null)
  const [sendPayment, { loading, data, errorsMessage: paymentError }] =
    useMutation.onChainPaymentSend()

  const {
    loading: feeLoading,
    data: feeData,
    errorsMessage: feeProbeError,
  } = useQuery.onChainTxFee({
    variables: {
      walletId: props.btcWalletId,
      address: props.address,
      amount: props.satAmount,
    },
  })

  const feeSatAmount = feeData?.onChainTxFee?.amount

  const handleSend = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const rootSpan = tracer.startSpan("web wallet")
    await withTracing("on-chain send", rootSpan, async () => {
      sendPayment({
        variables: {
          input: {
            walletId: props.btcWalletId,
            address: props.address,
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
      loading={loading || feeLoading}
      error={paymentError || feeProbeError}
      data={data?.onChainPaymentSend}
      feeSatAmount={feeSatAmount}
      reset={props.reset}
      handleSend={handleSend}
    />
  )
}

export default SendOnChainAction
