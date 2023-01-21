import { gql } from "@apollo/client"

const usernameAvailable = gql`
  query usernameAvailable($username: Username!) {
    usernameAvailable(username: $username)
  }
`

export default usernameAvailable
