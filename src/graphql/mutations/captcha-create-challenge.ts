import { gql } from "@apollo/client"

const captchaCreateChallenge = gql`
  mutation captchaCreateChallenge {
    captchaCreateChallenge {
      errors {
        __typename
        message
      }
      result {
        __typename
        id
        challengeCode
        newCaptcha
        failbackMode
      }
    }
  }
`
export default captchaCreateChallenge
