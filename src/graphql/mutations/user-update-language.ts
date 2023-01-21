import { gql } from "@apollo/client"

const userUpdateLanguage = gql`
  mutation userUpdateLanguage($input: UserUpdateLanguageInput!) {
    userUpdateLanguage(input: $input) {
      errors {
        __typename
        message
      }
      user {
        __typename
        id
        language
      }
    }
  }
`

export default userUpdateLanguage
