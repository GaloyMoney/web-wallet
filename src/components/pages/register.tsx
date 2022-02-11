import { AxiosError } from "axios"
import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody,
} from "@ory/kratos-client"
import { history } from "../../store/history"
import { useState, InputHTMLAttributes, useEffect } from "react"
import { KratosSdk, handleFlowError } from "../../kratos"
import config from "../../store/config"
import { Flow } from "../kratos"

interface RegisterProps {
  flowData?: KratosFlowData
}

const Register = ({ flowData: flowDataProp }: RegisterProps) => {
  const [flowData, setFlowData] = useState<SelfServiceRegistrationFlow | undefined>(
    flowDataProp?.registrationData,
  )
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
        .getSelfServiceRegistrationFlow(String(flowId),
          undefined,
        {withCredentials: true}
        )
        .then(({ data }) => {
          setFlowData(data)
        })
        .catch(
          handleFlowError({
            history,
            resetFlow: () => {
              setFlowData(undefined)
              history.push(`/register/email`)
            },
          }),
        )
      return
    }

    // need to initialize the flow
    kratos
      .initializeSelfServiceRegistrationFlowForBrowsers(
        params.get("return_to") || undefined,
        {withCredentials: true}
      )
      .then(({ data }) => {
        setFlowData(data)
      })
      .catch(
        handleFlowError({
          history,
          resetFlow: () => {
            setFlowData(undefined)
            history.push("/register/email")
          },
        }),
      )
  }, [flowData])

  const onSubmit = async (values: SubmitSelfServiceRegistrationFlowBody) => {
    const kratos = KratosSdk(config.kratosBrowserUrl)
    kratos
      .submitSelfServiceRegistrationFlow(String(flowData?.id), values,
              {withCredentials: true}
      )
      // .then(({ data }) => {
      .then(() => {
        return history.push(flowData?.return_to || "/")
      })
      .catch(
        handleFlowError({
          history,
          resetFlow: () => {
            setFlowData(undefined)
            history.push("/register/email")
          },
        }),
      )
      .catch((err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          setFlowData(err.response?.data)
          history.replace(`/register/email?flow=${flowData?.id}`)
          return
        }

        return Promise.reject(err)
      })
  }

  return (
    <>
      <Flow onSubmit={onSubmit} flow={flowData} />
    </>
  )
}

export default Register
