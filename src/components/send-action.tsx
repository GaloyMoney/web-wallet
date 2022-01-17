import { ApolloError, useMutation } from "@apollo/client"
import { MouseEvent } from "react"

import MUTATION_LN_INVOICE_PAYMENT_SEND from "store/graphql/mutation.ln-invoice-payment-send"
import MUTATION_LN_NOAMOUNT_INVOICE_PAYMENT_SEND from "store/graphql/mutation.ln-noamount-invoice-payment-send"
import MUTATION_INTRA_LEDGER_PAYMENT_SEND from "store/graphql/mutation.intra-ledger-paymest-send"

import Spinner from "./spinner"
import SuccessCheckmark from "./sucess-checkmark"
import MUTATION_ONCHAIN_PAYMENT_SEND from "store/graphql/mutation.onchain-payment-send"

type SendActionDisplayProps = {
  loading: boolean
  error: ApolloError | undefined
  data: GraphQL.PaymentSendPayload | undefined
  reset: () => void
  handleSend: (event: MouseEvent<HTMLButtonElement>) => void
}

const SendActionDisplay = ({
  loading,
  error,
  data,
  reset,
  handleSend,
}: SendActionDisplayProps) => {
  const errorString = error?.message ?? data?.errors?.map((err) => err.message).join(", ")
  const success = data?.status === "SUCCESS"

  return (
    <>
      {errorString && <div className="error">{errorString}</div>}
      {success ? (
        <div className="invoice-paid">
          <SuccessCheckmark />
          <button onClick={reset}>Send another payment</button>
        </div>
      ) : (
        <button onClick={handleSend} disabled={loading}>
          Send {loading && <Spinner size="small" />}
        </button>
      )}
    </>
  )
}

type SendActionProps = InvoiceInput & {
  btcWalletId: string
  reset: () => void
}

const SendLightningFixedAmount = (props: SendActionProps) => {
  const [sendPayment, { loading, error, data }] = useMutation<{
    lnInvoicePaymentSend: GraphQL.PaymentSendPayload
  }>(MUTATION_LN_INVOICE_PAYMENT_SEND, {
    onError: console.error,
  })

  const handleSend = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    sendPayment({
      variables: {
        input: {
          walletId: props.btcWalletId,
          paymentRequest: props.paymentRequset,
          memo: props.memo,
        },
      },
    })
  }

  return (
    <SendActionDisplay
      loading={loading}
      error={error}
      data={data?.lnInvoicePaymentSend}
      reset={props.reset}
      handleSend={handleSend}
    />
  )
}

const SendLightningAmount = (props: SendActionProps) => {
  const [sendPayment, { loading, error, data }] = useMutation<{
    lnNoAmountInvoicePaymentSend: GraphQL.PaymentSendPayload
  }>(MUTATION_LN_NOAMOUNT_INVOICE_PAYMENT_SEND, {
    onError: console.error,
  })

  const handleSend = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    sendPayment({
      variables: {
        input: {
          walletId: props.btcWalletId,
          paymentRequest: props.paymentRequset,
          amount: props.satAmount,
          memo: props.memo,
        },
      },
    })
  }

  return (
    <SendActionDisplay
      loading={loading}
      error={error}
      data={data?.lnNoAmountInvoicePaymentSend}
      reset={props.reset}
      handleSend={handleSend}
    />
  )
}

const SendOnChain = (props: SendActionProps) => {
  const [sendPayment, { loading, error, data }] = useMutation<{
    onChainPaymentSend: GraphQL.PaymentSendPayload
  }>(MUTATION_ONCHAIN_PAYMENT_SEND, {
    onError: console.error,
  })

  const handleSend = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
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
  }

  return (
    <SendActionDisplay
      loading={loading}
      error={error}
      data={data?.onChainPaymentSend}
      reset={props.reset}
      handleSend={handleSend}
    />
  )
}

const SendIntraLedger = (props: SendActionProps) => {
  const [sendPayment, { loading, error, data }] = useMutation<{
    intraLedgerPaymentSend: GraphQL.PaymentSendPayload
  }>(MUTATION_INTRA_LEDGER_PAYMENT_SEND, {
    onError: console.error,
  })

  const handleSend = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    sendPayment({
      variables: {
        input: {
          walletId: props.btcWalletId,
          recipientWalletId: props.reciepientWalletId,
          amount: props.satAmount,
          memo: props.memo,
        },
      },
    })
  }

  return (
    <SendActionDisplay
      loading={loading}
      error={error}
      data={data?.intraLedgerPaymentSend}
      reset={props.reset}
      handleSend={handleSend}
    />
  )
}

const SendAction = (props: SendActionProps) => {
  if (props.errorMessage) {
    return <div className="error">{props.errorMessage}</div>
  }

  const validInput =
    props.valid &&
    (props.fixedAmount || typeof props.amount === "number") &&
    (props.paymentType !== "intraledger" || props.reciepientWalletId)

  if (!validInput) {
    return <button disabled>Enter amount and destination</button>
  }

  if (props.paymentType === "lightning") {
    if (props.fixedAmount) {
      return <SendLightningFixedAmount {...props} />
    }

    return <SendLightningAmount {...props} />
  }

  if (props.paymentType === "onchain") {
    return <SendOnChain {...props} />
  }

  if (props.paymentType === "intraledger") {
    return <SendIntraLedger {...props} />
  }

  return <button disabled>Enter amount and destination</button>
}

export default SendAction
