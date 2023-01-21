import { gql } from "@apollo/client"
import transactionListFragment from "./transaction-list-fragment"

const meFragment = gql`
  fragment Me on User {
    id
    language
    username
    phone
    defaultAccount {
      id
      defaultWalletId
      transactions(first: $recentTransactions) {
        ...TransactionList
      }
      wallets {
        id
        balance
        walletCurrency
      }
    }
  }
  ${transactionListFragment}
`

export default meFragment
