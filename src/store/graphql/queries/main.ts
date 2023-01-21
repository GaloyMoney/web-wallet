import { gql } from "@apollo/client"
import meFragment from "../fragments/me-fragment"

const main = gql`
  query main($isAuthenticated: Boolean!, $recentTransactions: Int) {
    globals {
      nodesIds
      lightningAddressDomain
    }
    btcPrice {
      base
      offset
      currencyUnit
      formattedAmount
    }
    me @include(if: $isAuthenticated) {
      ...Me
    }
  }
  ${meFragment}
`

export default main
