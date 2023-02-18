import { gql } from "@apollo/client"

const lnNoAmountInvoicePaymentSend = gql`
  mutation lnNoAmountInvoicePaymentSend($input: LnNoAmountInvoicePaymentInput!) {
    lnNoAmountInvoicePaymentSend(input: $input) {
      errors {
        __typename
        message
      }
      status
    }
  }
`

export default lnNoAmountInvoicePaymentSend
