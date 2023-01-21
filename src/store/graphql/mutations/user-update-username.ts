import { gql } from "@apollo/client"

const userUpdateUsername = gql`
  mutation userUpdateUsername($input: UserUpdateUsernameInput!) {
    userUpdateUsername(input: $input) {
      errors {
        __typename
        message
      }
      user {
        __typename
        id
        username
      }
    }
  }
`

export default userUpdateUsername
