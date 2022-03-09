import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody,
} from "@ory/kratos-client"

import axios, { AxiosError } from "axios"
import { history } from "../../store/history"
import { useState, useEffect, useCallback } from "react"
import { KratosSdk, handleFlowError } from "../../kratos"
import { Flow } from "../kratos"
import { useAuthContext } from "store/use-auth-context"

import config from "store/config"
import Link from "components/link"
import { useRequest } from "store"

type FCT = React.FC<{
  flowData?: KratosFlowData
}>

const Register: FCT = ({ flowData: flowDataProp }) => {
  const request = useRequest()
  const { setAuthSession } = useAuthContext()

  const [flowData, setFlowData] = useState<SelfServiceRegistrationFlow | undefined>(
    flowDataProp?.registrationData,
  )

  const resetFlow = useCallback(() => {
    setFlowData(undefined)
    document.location.href = "/register"
  }, [])

  useEffect(() => {
    if (flowData) {
      return
    }

    const kratos = KratosSdk(config.kratosBrowserUrl)
    const params = new URLSearchParams(window.location.search)
    const flowId = params.get("flow")

    // flow id exists, we can fetch the flow data
    if (flowId) {
      kratos
        .getSelfServiceRegistrationFlow(String(flowId), undefined, {
          withCredentials: true,
        })
        .then(({ data }) => {
          setFlowData(data)
        })
        .catch(handleFlowError({ history, resetFlow }))
      return
    }

    // need to initialize the flow
    kratos
      .initializeSelfServiceRegistrationFlowForBrowsers(
        params.get("return_to") || undefined,
        { withCredentials: true },
      )
      .then(({ data }) => {
        setFlowData(data)
      })
      .catch(handleFlowError({ history, resetFlow }))
  }, [flowData, resetFlow])

  const onSubmit = async (values: SubmitSelfServiceRegistrationFlowBody) => {
    const kratos = KratosSdk(config.kratosBrowserUrl)
    kratos
      .submitSelfServiceRegistrationFlow(String(flowData?.id), values, {
        withCredentials: true,
      })
      .then(async ({ data }) => {
        try {
          if (!data.session) {
            throw new Error("Invaild session")
          }
          const resp = await axios.post(
            config.kratosAuthEndpoint,
            {},
            { withCredentials: true },
          )
          if (!resp.data.authToken) {
            throw new Error("Invalid auth token respose")
          }
          const authToken = resp.data.authToken
          const { galoyJwtToken } = await request.post(config.authEndpoint, {
            authToken,
          })
          if (!galoyJwtToken) {
            throw new Error("Invalid auth token respose")
          }
          const session = {
            galoyJwtToken,
            identity: { emailAddress: data.session.identity.traits.email },
          }
          setAuthSession(session.galoyJwtToken ? session : null)
          history.push("/")
        } catch (err) {
          console.error(err)
        }
      })
      .catch(handleFlowError({ history, resetFlow }))
      .catch((err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          setFlowData(err.response?.data)
          document.location.replace(`/register?flow=${flowData?.id}`)
          return
        }

        return Promise.reject(err)
      })
  }

  return (
    <>
      <div className="register-form auth-form">
        <Flow onSubmit={onSubmit} flow={flowData} />
      </div>
      <div className="form-links">
        <Link to="/login">
          <i aria-hidden className="fas fa-sign-in-alt" />
          Login
        </Link>
      </div>
    </>
  )
}

export default Register
