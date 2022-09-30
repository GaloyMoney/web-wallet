import { useMutation, useQuery } from "@galoymoney/client"
import React, { MouseEvent } from "react"

import SendActionDisplay from "components/send/send-action-display"
import { SendActionProps } from "components/send/send-action"
import { recordTrace } from "store/client-tracing/tracing"

export type SendOnChainActionProps = SendActionProps & {
  address: string
  satAmount: number
}

type FCT = React.FC<SendOnChainActionProps>

const SendOnChainAction: FCT = (props) => {
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
    await recordTrace({
      spanName: "on-chain-send",
      fnName: sendPayment.name,
      exception: paymentError,
      fn: () => {
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
      },
    })
  }

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
