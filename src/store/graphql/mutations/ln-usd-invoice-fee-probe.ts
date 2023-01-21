import { gql } from "@apollo/client"

const lnUsdInvoiceFeeProbe = gql`
  mutation lnUsdInvoiceFeeProbe($input: LnUsdInvoiceFeeProbeInput!) {
    lnUsdInvoiceFeeProbe(input: $input) {
      errors {
        __typename
        message
      }
      amount
    }
  }
`
export default lnUsdInvoiceFeeProbe
