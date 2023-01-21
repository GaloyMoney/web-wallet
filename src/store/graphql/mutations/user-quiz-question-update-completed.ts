import { gql } from "@apollo/client"

const userQuizQuestionUpdateCompleted = gql`
  mutation userQuizQuestionUpdateCompleted(
    $input: UserQuizQuestionUpdateCompletedInput!
  ) {
    userQuizQuestionUpdateCompleted(input: $input) {
      errors {
        __typename
        message
      }
      userQuizQuestion {
        question {
          id
          earnAmount
        }
        completed
      }
    }
  }
`

export default userQuizQuestionUpdateCompleted
