import { gql } from "@apollo/client"

const lnInvoiceFeeProbe = gql`
  mutation lnInvoiceFeeProbe($input: LnInvoiceFeeProbeInput!) {
    lnInvoiceFeeProbe(input: $input) {
      errors {
        __typename
        message
      }
      amount
    }
  }
`
export default lnInvoiceFeeProbe
