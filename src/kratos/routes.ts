/* eslint-disable camelcase */

import { requireNoAuth } from "./middleware"
import { kratosValues, getUrlForFlow, isQuerySet, redirectOnSoftError } from "./config"
import { Router, NextFunction, Request, Response } from "express"

export const createSignupRoute = (req: Request, res: Response, next: NextFunction) => {
  res.locals.projectName = "Create account"

  const { flow, return_to = "" } = req.query
  const { kratosSdk, apiBaseUrl } = kratosValues
  const initFlowUrl = getUrlForFlow(
    apiBaseUrl,
    "registration",
    new URLSearchParams({ return_to: return_to.toString() }),
  )
  const initLoginUrl = getUrlForFlow(
    apiBaseUrl,
    "login",
    new URLSearchParams({
      return_to: return_to.toString(),
    }),
  )

  // The flow is used to identify the settings and registration flow and
  // return data like the csrf_token and so on.
  if (!isQuerySet(flow)) {
    console.log("No flow ID found in URL query initializing login flow", {
      query: req.query,
    })
    res.redirect(303, initFlowUrl)
    return
  }

  kratosSdk
    .getSelfServiceRegistrationFlow(flow, req.header("Cookie"))
    .then(({ data }) => {
      // Render the data using a view (e.g. Jade Template):
      res.render("index", {
        ...data,
        signInUrl: initLoginUrl,
      })
    })
    .catch(redirectOnSoftError(res, next, initFlowUrl))
}

export const registerSignupRoute = (app: Router) => {
  app.get("/signup/email", requireNoAuth, createSignupRoute)
}
