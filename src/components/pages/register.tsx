import { SelfServiceRegistrationFlow } from "@ory/kratos-client"
import { useState } from "react"

interface RegisterProps {
  kratosData: KratosFlowData
}

const Register = ({ kratosData: { registrationData } }: RegisterProps) => {
  const [flowData, setFlowData] = useState<SelfServiceRegistrationFlow | undefined>(
    registrationData,
  )
  return <div className="register">register</div>
}

export default Register
