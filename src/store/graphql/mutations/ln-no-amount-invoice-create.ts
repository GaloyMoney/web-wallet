import { gql } from "@apollo/client"

const lnNoAmountInvoiceCreate = gql`
  mutation lnNoAmountInvoiceCreate($input: LnNoAmountInvoiceCreateInput!) {
    lnNoAmountInvoiceCreate(input: $input) {
      errors {
        __typename
        message
      }
      invoice {
        __typename
        paymentHash
        paymentRequest
        paymentSecret
      }
    }
  }
`
export default lnNoAmountInvoiceCreate
