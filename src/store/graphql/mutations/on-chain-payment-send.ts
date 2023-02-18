import { gql } from "@apollo/client"

const onChainPaymentSend = gql`
  mutation onChainPaymentSend($input: OnChainPaymentSendInput!) {
    onChainPaymentSend(input: $input) {
      errors {
        __typename
        message
      }
      status
    }
  }
`

export default onChainPaymentSend
