import { gql } from "@apollo/client"

const accountUpdateDefaultWalletId = gql`
  mutation accountUpdateDefaultWalletId($input: AccountUpdateDefaultWalletIdInput!) {
    accountUpdateDefaultWalletId(input: $input) {
      errors {
        __typename
        message
      }
      account {
        __typename
        id
        defaultWalletId
      }
    }
  }
`
export default accountUpdateDefaultWalletId
