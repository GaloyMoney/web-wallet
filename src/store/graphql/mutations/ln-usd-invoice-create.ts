import { gql } from "@apollo/client"

const lnUsdInvoiceCreate = gql`
  mutation lnUsdInvoiceCreate($input: LnUsdInvoiceCreateInput!) {
    lnUsdInvoiceCreate(input: $input) {
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

export default lnUsdInvoiceCreate
