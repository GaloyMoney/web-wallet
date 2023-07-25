/* eslint-disable camelcase */
import React from "react"

import { config, translate, history, useAuthContext, ajax } from "store/index"

import Link from "components/link"
import Icon from "components/icon"
import { Spinner } from "@galoymoney/react"

type FCT = React.FC

const LoginEmailCode: FCT = () => {
  const { setAuthSession } = useAuthContext()
  const [emailAddress, setEmailAddress] = React.useState("")
  const [emailLoginId, setEmailLoginId] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string>("")
  const [step, setStep] = React.useState<"enterEmail" | "enterCode" | "emailComplete">(
    "enterEmail",
  )

  const submit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setErrorMessage("")
    switch (step) {
      case "enterEmail": {
        const emailInput = event.currentTarget.email.value
        setEmailAddress(emailInput)
        setLoading(true)
        try {
          const res = await ajax.post(config.galoyAuthEndpoint + "/email/code", {
            email: emailInput,
          })
          if (res.error) {
            setErrorMessage(res.error)
          } else {
            setEmailLoginId(res.result)
            setStep("enterCode")
          }
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
        break
      }
      case "enterCode": {
        const code = event.currentTarget.code.value
        try {
          setLoading(true)
          const session = await ajax.post(
            config.galoyAuthEndpoint + "/email/login/cookie",
            {
              emailLoginId,
              code,
            },
          )
          if (session.error) {
            setErrorMessage(session.error)
          } else if (session.identity.kratosUserId) {
            const identity = {
              id: session.identity.kratosUserId,
              emailAddress,
              uid: session.identity.kratosUserId,
            }
            setAuthSession({ identity })
            history.push("/")
          } else {
            setErrorMessage(translate("Something went wrong"))
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
    <div className="login-form auth-form">
      <form onSubmit={submit}>
        {step === "enterEmail" && (
          <>
            <div className="input-container">
              <div className="">{translate("Email")}</div>
              <input type="email" name="email" placeholder={translate("Email")} />
            </div>
            <div className="button-container">
              <button className="button" type="submit" disabled={loading}>
                {translate("Login")}
              </button>
              <Link to="/">{translate("Cancel")}</Link>
            </div>
          </>
        )}
        {step === "enterCode" && (
          <div>
            <div className="grouped-input-button">
              <div className="input-label-right">
                <input type="text" name="code" placeholder="Enter Code" />
              </div>
              <button type="submit" disabled={loading} style={{ marginTop: 0 }}>
                {loading ? <Spinner size="small" /> : <Icon name="submit" />}
              </button>
            </div>
          </div>
        )}
        {errorMessage && <div className="error">{errorMessage}</div>}
      </form>
    </div>
  )
}

export default LoginEmailCode
