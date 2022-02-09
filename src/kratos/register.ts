/* eslint-disable camelcase */

import { SelfServiceRegistrationFlow } from "@ory/kratos-client"
import { Request, Response } from "express"
import { getUrlForFlow, isQuerySet, kratosValues } from "./config"

export const handleRegister = async (req: Request): Promise<HandleRegisterResponse> => {
  const { flow, return_to = "" } = req.query
  const { kratosSdk, apiBaseUrl } = kratosValues

  // The flow is used to identify the settings and registration flow and
  // return data like the csrf_token and so on.
  if (!isQuerySet(flow)) {
    console.log("No flow ID found in URL query initializing login flow", {
      query: req.query,
    })
    const initFlowUrl = getUrlForFlow(
      apiBaseUrl,
      "registration",
      new URLSearchParams({ return_to: return_to.toString() }),
    )
    return { redirect: initFlowUrl }
  }

  return kratosSdk
    .getSelfServiceRegistrationFlow(flow, req.header("Cookie"))
    .then(({ data }: { data: SelfServiceRegistrationFlow }) => {
      return { registrationData: data }
    })
}
