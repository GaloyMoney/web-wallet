import { gql } from "@apollo/client"

const lnInvoicePaymentStatus = gql`
  subscription lnInvoicePaymentStatus($input: LnInvoicePaymentStatusInput!) {
    lnInvoicePaymentStatus(input: $input) {
      __typename
      errors {
        message
      }
      status
    }
  }
`
export default lnInvoicePaymentStatus
