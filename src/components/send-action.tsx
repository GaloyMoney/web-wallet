import { useMutation } from "@apollo/client"
import { MouseEvent } from "react"
import { useAppDispatcher } from "store"

import MUTATION_LN_INVOICE_PAYMENT_SEND from "store/graphql/mutation.ln-invoice-payment-send"
import useMainQuery from "store/use-main-query"
import Spinner from "./spinner"
import SuccessCheckmark from "./sucess-checkmark"

type Props = {
  paymentRequest: string
  memo?: string
}

const SendAction = ({ paymentRequest, memo }: Props) => {
  const dispatch = useAppDispatcher()
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
      variables: { input: { walletId: btcWalletId, paymentRequest, memo } },
    })
  }

  const resetSendScreen = () => {
    dispatch({ type: "reset-current-screen" })
  }

  return (
    <>
      {errorString && <div className="error">{errorString}</div>}
      {success ? (
        <>
          <SuccessCheckmark />
          <button onClick={resetSendScreen}>Send a new payment</button>
        </>
      ) : (
        <button onClick={handleSend} disabled={loading}>
          Send {loading && <Spinner size="small" />}
        </button>
      )}
    </>
  )
}

export default SendAction
