import { gql } from "@apollo/client"

const contacts = gql`
  query contacts {
    me {
      id
      contacts {
        username
        alias
        transactionsCount
      }
    }
  }
`

export default contacts
