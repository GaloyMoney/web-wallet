import { useMutation } from "@apollo/client"
import { MouseEvent } from "react"

import MUTATION_LN_INVOICE_PAYMENT_SEND from "store/graphql/mutation.ln-invoice-payment-send"
import useMainQuery from "store/use-main-query"
import Spinner from "./spinner"
import SuccessCheckmark from "./sucess-checkmark"

type SendActionProps = InvoiceInput & {
  reset: () => void
}

const SendFixedAmount = (props: SendActionProps) => {
  const { btcWalletId } = useMainQuery()

  const [payInvoice, { loading, error, data }] = useMutation<{
    lnInvoicePaymentSend: GraphQL.PaymentSendPayload
  }>(MUTATION_LN_INVOICE_PAYMENT_SEND, {
    onError: console.error,
  })

  const errorString =
    error?.message ??
    data?.lnInvoicePaymentSend?.errors?.map((err) => err.message).join(", ")
  const success = data?.lnInvoicePaymentSend?.status === "SUCCESS"

  const handleSend = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    payInvoice({
      variables: {
        input: {
          walletId: btcWalletId,
          paymentRequest: props.paymentRequset,
          memo: props.memo,
        },
      },
    })
  }

  const validInput =
    props.valid && (props.fixedAmount || typeof props.amount === "number")

  if (!validInput) {
    return <button disabled>Enter amount and destination</button>
  }

  return (
    <>
      {errorString && <div className="error">{errorString}</div>}
      {success ? (
        <div className="invoice-paid">
          <SuccessCheckmark />
          <button onClick={props.reset}>Send another payment</button>
        </div>
      ) : (
        <button onClick={handleSend} disabled={loading}>
          Send {loading && <Spinner size="small" />}
        </button>
      )}
    </>
  )
}

const SendAction = (props: SendActionProps) => {
  const validInput =
    props.valid && (props.fixedAmount || typeof props.amount === "number")

  if (!validInput) {
    return <button disabled>Enter amount and destination</button>
  }

  if (props.fixedAmount) {
    return <SendFixedAmount {...props} />
  }

  return null
}

export default SendAction
