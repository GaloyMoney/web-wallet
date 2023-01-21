import { gql } from "@apollo/client"

const lnNoAmountUsdInvoiceFeeProbe = gql`
  mutation lnNoAmountUsdInvoiceFeeProbe($input: LnNoAmountUsdInvoiceFeeProbeInput!) {
    lnNoAmountUsdInvoiceFeeProbe(input: $input) {
      errors {
        __typename
        message
      }
      amount
    }
  }
`
export default lnNoAmountUsdInvoiceFeeProbe
