import { gql } from "@apollo/client"

const userContactUpdateAlias = gql`
  mutation userContactUpdateAlias($input: UserContactUpdateAliasInput!) {
    userContactUpdateAlias(input: $input) {
      errors {
        __typename
        message
      }
    }
  }
`
export default userContactUpdateAlias
