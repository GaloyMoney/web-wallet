import { gql } from "@apollo/client"

const lnNoAmountInvoiceFeeProbe = gql`
  mutation lnNoAmountInvoiceFeeProbe($input: LnNoAmountInvoiceFeeProbeInput!) {
    lnNoAmountInvoiceFeeProbe(input: $input) {
      errors {
        __typename
        message
      }
      amount
    }
  }
`
export default lnNoAmountInvoiceFeeProbe
