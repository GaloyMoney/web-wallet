import { gql } from "@apollo/client"

const userLogin = gql`
  mutation userLogin($input: UserLoginInput!) {
    userLogin(input: $input) {
      errors {
        __typename
        message
      }
      authToken
    }
  }
`

export default userLogin
