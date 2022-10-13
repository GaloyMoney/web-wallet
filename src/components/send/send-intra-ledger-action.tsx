import { useMutation } from "@galoymoney/client"
import React, { MouseEvent } from "react"

import SendActionDisplay from "components/send/send-action-display"
import { SendActionProps } from "components/send/send-action"
import { recordTrace } from "store/client-tracing/tracing"

export type SendIntraLedgerActionProps = SendActionProps & {
  recipientWalletId: string
  satAmount: number
}

type FCT = React.FC<SendIntraLedgerActionProps>

const SendIntraLedgerAction: FCT = (props) => {
  const [sendPayment, { loading, errorsMessage, data }] =
    useMutation.intraLedgerPaymentSend()

  const handleSend = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await recordTrace({
      spanName: "intra-ledger-send",
      fnName: sendPayment.name,
      exception: errorsMessage,
      fn: () => {
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
      },
    })
  }

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
