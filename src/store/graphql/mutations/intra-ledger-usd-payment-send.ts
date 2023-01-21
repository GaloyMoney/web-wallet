import { gql } from "@apollo/client"

const intraLedgerUsdPaymentSend = gql`
  mutation intraLedgerUsdPaymentSend($input: IntraLedgerUsdPaymentSendInput!) {
    intraLedgerUsdPaymentSend(input: $input) {
      errors {
        __typename
        message
      }
      status
    }
  }
`
export default intraLedgerUsdPaymentSend
