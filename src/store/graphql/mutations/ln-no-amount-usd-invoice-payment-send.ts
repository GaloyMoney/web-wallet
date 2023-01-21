import { gql } from "@apollo/client"

const lnNoAmountUsdInvoicePaymentSend = gql`
  mutation lnNoAmountUsdInvoicePaymentSend($input: LnNoAmountUsdInvoicePaymentInput!) {
    lnNoAmountUsdInvoicePaymentSend(input: $input) {
      errors {
        __typename
        message
      }
      status
    }
  }
`

export default lnNoAmountUsdInvoicePaymentSend
