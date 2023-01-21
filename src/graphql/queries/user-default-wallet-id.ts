import { gql } from "@apollo/client"

const userDefaultWalletId = gql`
  query userDefaultWalletId($username: Username!) {
    userDefaultWalletId(username: $username)
  }
`

export default userDefaultWalletId
