import { useState, useEffect, useCallback } from "react"
import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from "@ory/kratos-client"
import { AxiosError } from "axios"

import { history } from "../../store/history"
import { KratosSdk, handleFlowError } from "../../kratos"
import { Flow } from "../kratos"

import config from "store/config"
import Link from "components/link"

type FCT = React.FC<{
  flowData?: KratosFlowData
}>

const LoginEmail: FCT = ({ flowData: flowDataProp }) => {
  const [flowData, setFlowData] = useState<SelfServiceLoginFlow | undefined>(
    flowDataProp?.loginData,
  )

  const resetFlow = useCallback(() => {
    setFlowData(undefined)
    document.location.href = "/login"
  }, [])

  useEffect(() => {
    if (flowData) {
      return
    }

    const kratos = KratosSdk(config.kratosBrowserUrl)
    const params = new URLSearchParams(window.location.search)
    const flowId = params.get("flow")
    const returnTo = params.get("return_to")
    const refresh = params.get("refresh")
    const aal = params.get("all")

    // flow id exists, we can fetch the flow data
    if (flowId) {
      kratos
        .getSelfServiceLoginFlow(String(flowId))
        .then(({ data }) => {
          setFlowData(data)
        })
        .catch(handleFlowError({ history, resetFlow }))
      return
    }

    // need to initialize the flow
    kratos
      .initializeSelfServiceLoginFlowForBrowsers(
        Boolean(refresh),
        aal ? String(aal) : undefined,
        returnTo ? String(returnTo) : undefined,
      )
      .then(({ data }) => {
        setFlowData(data)
      })
      .catch(handleFlowError({ history, resetFlow }))
  }, [flowData, resetFlow])

  const onSubmit = async (values: SubmitSelfServiceLoginFlowBody) => {
    const kratos = KratosSdk(config.kratosBrowserUrl)
    kratos
      .submitSelfServiceLoginFlow(String(flowData?.id), undefined, values, {
        withCredentials: true,
      })
      .then(() => {
        document.location.replace(flowData?.return_to || "/")
      })
      .catch(handleFlowError({ history, resetFlow }))
      .catch((err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          setFlowData(err.response?.data)
          document.location.replace(`/login?flow=${flowData?.id}`)
          return
        }

        return Promise.reject(err)
      })
  }

  return (
    <>
      <div className="login-form auth-form">
        <Flow onSubmit={onSubmit} flow={flowData} />
      </div>
      <div className="form-links">
        <Link to="/register">
          <i aria-hidden className="fas fa-sign-in-alt" />
          Create new account
        </Link>
        <div className="separator">|</div>
        <Link to="/recovery">
          <i aria-hidden className="fas fa-key" />
          Recover your account
        </Link>
      </div>
    </>
  )
}

export default LoginEmail
