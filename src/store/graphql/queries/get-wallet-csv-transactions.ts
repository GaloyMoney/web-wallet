import { gql } from "@apollo/client"

const getWalletCsvTransactions = gql`
  query defaultWalletCsvTransactions($defaultWalletId: WalletId!) {
    me {
      id
      defaultAccount {
        id
        csvTransactions(walletIds: [$defaultWalletId])
      }
    }
  }
`

export default getWalletCsvTransactions
