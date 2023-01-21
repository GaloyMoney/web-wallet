import { gql } from "@apollo/client"

const lnInvoiceCreateOnBehalfOfRecipient = gql`
  mutation lnInvoiceCreateOnBehalfOfRecipient(
    $input: LnInvoiceCreateOnBehalfOfRecipientInput!
  ) {
    lnInvoiceCreateOnBehalfOfRecipient(input: $input) {
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

export default lnInvoiceCreateOnBehalfOfRecipient
