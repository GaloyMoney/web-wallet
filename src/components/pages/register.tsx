import { SelfServiceRegistrationFlow } from "@ory/kratos-client"
import { useState } from "react"
import { getUrlForFlow, KratosFlow } from "../../kratos"
import config from "../../store/config"

type FCT = React.FC<{
  flowData?: KratosFlowData
}>

const Register: FCT = ({ flowData: flowDataProp }) => {
  const [flowData] = useState<SelfServiceRegistrationFlow | undefined>(
    flowDataProp?.registrationData,
  )

  if (!flowData) {
    window.location.href = getUrlForFlow({
      flow: KratosFlow.Registration,
      kratosBrowserUrl: config.kratosBrowserUrl,
    })
    return <></>
  }

  return <div className="register">{JSON.stringify(flowData)}</div>
}

export default Register
