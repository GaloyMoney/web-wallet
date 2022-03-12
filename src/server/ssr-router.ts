import express from "express"

import { serverRenderer } from "../renderers/server"
import { checkRoute } from "./routes"
import { handleRegister, handleLogin } from "../kratos"
import config from "../store/config"

const ssrRouter = express.Router({ caseSensitive: true })

ssrRouter.get("/logout", async (req, res) => {
  req.session = req.session || {}
  req.session.galoyJwtToken = null
  return res.redirect("/")
})

ssrRouter.get("/*", async (req, res) => {
  try {
    const routePath = req.path
    const checkedRoutePath = checkRoute(routePath)
    if (!(checkedRoutePath instanceof Error)) {
      const vars = await serverRenderer(req)({
        path: checkedRoutePath,
      })
      return res.render("index", vars)
    }

    if (config.kratosFeatureFlag) {
      let flowData = undefined
      switch (routePath) {
        case "/register": {
          const registerResult = await handleRegister(req, config.kratosBrowserUrl)
          if (registerResult.redirect) {
            return res.redirect(registerResult.redirectTo)
          }
          flowData = registerResult.flowData
          break
        }

        case "/login": {
          const loginResult = await handleLogin(req, config.kratosBrowserUrl)
          if (loginResult.redirect) {
            return res.redirect(loginResult.redirectTo)
          }
          flowData = loginResult.flowData
          break
        }

        default:
          return res.status(404).send("Resource not found")
      }
      const vars = await serverRenderer(req)({
        path: routePath,
        flowData,
      })
      return res.render("index", vars)
    }
    return res.status(404).send("Resource not found")
  } catch (err) {
    console.error(err)
    return res.status(500).send("Server error")
  }
})

export default ssrRouter
