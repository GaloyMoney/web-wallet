import { gql } from "@apollo/client"

const accountDefaultWallet = gql`
  query accountDefaultWallet($username: Username!) {
    accountDefaultWallet(username: $username) {
      __typename
      id
      walletCurrency
    }
  }
`
export default accountDefaultWallet
