import { gql } from "@apollo/client"

const lnUsdInvoiceCreateOnBehalfOfRecipient = gql`
  mutation lnUsdInvoiceCreateOnBehalfOfRecipient(
    $input: LnUsdInvoiceCreateOnBehalfOfRecipientInput!
  ) {
    lnUsdInvoiceCreateOnBehalfOfRecipient(input: $input) {
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

export default lnUsdInvoiceCreateOnBehalfOfRecipient
