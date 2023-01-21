import { gql } from "@apollo/client"

const lnInvoiceCreate = gql`
  mutation lnInvoiceCreate($input: LnInvoiceCreateInput!) {
    lnInvoiceCreate(input: $input) {
      errors {
        __typename
        message
      }
      invoice {
        __typename
        paymentHash
        paymentRequest
        paymentSecret
        satoshis
      }
    }
  }
`
export default lnInvoiceCreate
