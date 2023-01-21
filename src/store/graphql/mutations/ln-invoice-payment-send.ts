import { gql } from "@apollo/client"

const lnInvoicePaymentSend = gql`
  mutation lnInvoicePaymentSend($input: LnInvoicePaymentInput!) {
    lnInvoicePaymentSend(input: $input) {
      errors {
        __typename
        message
      }
      status
    }
  }
`

export default lnInvoicePaymentSend
