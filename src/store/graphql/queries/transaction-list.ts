import { gql } from "@apollo/client"
import transactionListFragment from "../fragments/transaction-list-fragment"

const transactionList = gql`
  query transactionList($first: Int, $after: String, $last: Int, $before: String) {
    me {
      id
      defaultAccount {
        id
        wallets {
          id
          transactions(first: $first, after: $after, last: $last, before: $before) {
            ...TransactionList
          }
        }
      }
    }
  }
  ${transactionListFragment}
`

export default transactionList
