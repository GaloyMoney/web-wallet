import { translate } from "store/index"
import { Spinner } from "@galoymoney/react"

import Icon from "components/icon"
import { gql } from "@apollo/client"
import React from "react"
import {
  useUserEmailRegistrationInitiateMutation,
  useUserEmailRegistrationValidateMutation,
  useUserEmailDeleteMutation,
  useEmailQuery,
} from "graphql/generated"

gql`
  mutation userEmailRegistrationInitiate($input: UserEmailRegistrationInitiateInput!) {
    userEmailRegistrationInitiate(input: $input) {
      errors {
        message
      }
      emailRegistrationId
      me {
        id
        email {
          address
          verified
        }
      }
    }
  }
`

gql`
  mutation userEmailRegistrationValidate($input: UserEmailRegistrationValidateInput!) {
    userEmailRegistrationValidate(input: $input) {
      errors {
        message
      }
      me {
        id
        email {
          address
          verified
        }
      }
    }
  }
`

gql`
  mutation userEmailDelete {
    userEmailDelete {
      errors {
        message
      }
      me {
        id
        email {
          address
          verified
        }
      }
    }
  }
`

gql`
  query email {
    me {
      email {
        address
        verified
      }
      totpEnabled
    }
  }
`

type FCT = React.FC<{ guestView: boolean }>

const EmailSetting: FCT = ({ guestView }) => {
  const [emailAddress, setEmailAddress] = React.useState("")
  const [emailRegistrationId, setEmailRegistrationId] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [setEmailMutation] = useUserEmailRegistrationInitiateMutation()
  const [emailVerify] = useUserEmailRegistrationValidateMutation()
  const [errorMessage, setErrorMessage] = React.useState<string>("")
  const [emailDeleteMutation] = useUserEmailDeleteMutation()
  const [step, setStep] = React.useState<
    | "emailExists"
    | "enterEmail"
    | "enterCode"
    | "emailComplete"
    | "deleteEmail"
    | "resendCode"
  >("enterEmail")

  const submitEmail = async (emailInput: string) => {
    try {
      const { data: emailMutationData } = await setEmailMutation({
        variables: { input: { email: emailInput } },
      })
      const errors = emailMutationData?.userEmailRegistrationInitiate.errors
      if (errors && errors.length > 0) {
        setErrorMessage(errors[0].message)
        return
      }
      const emailRegistrationKey =
        emailMutationData?.userEmailRegistrationInitiate.emailRegistrationId
      if (emailRegistrationKey) {
        setEmailRegistrationId(emailRegistrationKey)
        setStep("enterCode")
      } else {
        setErrorMessage("Missing Email Registration Id")
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteEmail = async () => {
    try {
      setErrorMessage("")
      setLoading(true)
      await emailDeleteMutation()
      setEmailAddress("")
      setStep("enterEmail")
    } catch (err) {
      let message = ""
      if (err instanceof Error) {
        message = err?.message
      }
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async (emailInput: string) => {
    await emailDeleteMutation()
    submitEmail(emailInput)
  }

  const { data } = useEmailQuery({
    onCompleted: (emailData) => {
      setLoading(false)
      const hasEmail = Boolean(emailData?.me?.email?.address)
      const isVerified = Boolean(emailData?.me?.email?.verified)
      if (hasEmail && !isVerified) {
        setStep("enterCode")
      } else if (hasEmail && isVerified) {
        setStep("emailComplete")
      }
    },
  })

  const email = data?.me?.email?.address
  const emailSetButUnverified = Boolean(email) && (!data?.me?.email?.verified || false)

  const submit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setErrorMessage("")
    switch (step) {
      case "enterEmail": {
        const emailInput = event.currentTarget.email.value
        setEmailAddress(emailInput)
        setLoading(true)
        submitEmail(emailInput)
        break
      }
      case "enterCode": {
        const code = event.currentTarget.code.value
        try {
          setLoading(true)
          const res = await emailVerify({
            variables: { input: { code, emailRegistrationId } },
          })

          if (res.data?.userEmailRegistrationValidate.errors) {
            const error = res.data.userEmailRegistrationValidate.errors[0]?.message
            setErrorMessage(error)
          }

          if (res.data?.userEmailRegistrationValidate.me?.email?.verified) {
            setStep("emailComplete")
          }
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
        break
      }
    }
  }

  return (
    <div className="setting">
      <div className="icon">
        <Icon name="at" />
      </div>
      <div className="name">
        {translate("Email")}
        <div className="sub">{guestView ? "(not logged in)" : ""}</div>
        {(step === "emailComplete" || data?.me?.email?.address) && (
          <div className="sub">
            {emailAddress || data?.me?.email?.address}
            <a style={{ paddingLeft: 6 }} onClick={deleteEmail}>
              x
            </a>
          </div>
        )}
      </div>
      <div className="action">
        <form onSubmit={submit}>
          {step === "enterEmail" && (
            <div className="grouped-input-button">
              <div className="input-label-right">
                <input type="text" name="email" placeholder={translate("Email")} />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? <Spinner size="small" /> : <Icon name="submit" />}
              </button>
            </div>
          )}
          {step === "enterCode" && (
            <div>
              {emailSetButUnverified && email && (
                <>
                  {emailRegistrationId ? (
                    <div style={{ paddingRight: 6, paddingBottom: 6 }}>
                      Not verified. Check email for code or &nbsp;
                      <a onClick={() => resendCode(email)}> resend code</a>
                    </div>
                  ) : (
                    <div style={{ paddingRight: 6, paddingBottom: 6 }}>
                      Code is expired. &nbsp;
                      <a onClick={() => resendCode(email)}> Resend code</a>
                      &nbsp; then check email
                    </div>
                  )}
                </>
              )}
              <div className="grouped-input-button">
                <div className="input-label-right">
                  <input type="text" name="code" placeholder="Enter Code" />
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? <Spinner size="small" /> : <Icon name="submit" />}
                </button>
              </div>
            </div>
          )}
          {errorMessage && <div className="error-hint">{errorMessage}</div>}
        </form>
      </div>
    </div>
  )
}

export default EmailSetting
