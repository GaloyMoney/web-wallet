import { gql } from "@apollo/client"

const quizQuestions = gql`
  query quizQuestions {
    quizQuestions {
      id
      earnAmount
    }
  }
`

export default quizQuestions
