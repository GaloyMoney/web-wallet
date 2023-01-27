import express from "express"

import { config } from "@/store/index"

const router = express.Router({ caseSensitive: true })

router.get("/debug", async (req, res) => {
  res.send({
    version: "0.3.0", // FIXME: automate
    network: config.network,
    graphqlUrl: config.graphqlUrl,
    graphqlSubscriptionUrl: config.graphqlSubscriptionUrl,
    authEndpoint: config.authEndpoint,
    kratosBrowserUrl: config.kratosBrowserUrl,
    galoyAuthEndpoint: config.galoyAuthEndpoint,
  })
})

router.get("/verified", (req, res) => {
  req.session = req.session || {}
  req.session.emailVerified = true
  res.redirect("/")
})

router.get("/*", async (req, res) => {
  return res.render("index")
})

export default router
