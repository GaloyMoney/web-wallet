import { gql } from "@apollo/client"

const currencyList = gql`
  query currencyList {
    currencyList {
      code
      symbol
      name
      flag
    }
  }
`
export default currencyList
