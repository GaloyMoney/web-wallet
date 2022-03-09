import express from "express"
import * as jwt from "jsonwebtoken"

import { MUTATIONS } from "@galoymoney/client"

import { createClient } from "store/index"
import { handleWhoAmI } from "kratos"

const apiRouter = express.Router({ caseSensitive: true })

apiRouter.post("/login", async (req, res) => {
  try {
    const { authToken, phoneNumber, authCode } = req.body

    if (authToken) {
      const token = jwt.decode(authToken) as jwt.JwtPayload & { kratosUserId: string }
      const kratosSession = await handleWhoAmI(req)

      if (
        !token.kratosUserId ||
        !kratosSession ||
        kratosSession.identity.id !== token.kratosUserId
      ) {
        return res.send(404).send("Invaild login request")
      }

      req.session = req.session || {}
      req.session.galoyJwtToken = authToken
      return res.send({ galoyJwtToken: authToken })
    }

    if (!phoneNumber || !authCode) {
      throw new Error("INVALID_LOGIN_REQUEST")
    }

    const { data } = await createClient({
      headers: req.headers,
    }).mutate({
      mutation: MUTATIONS.userLogin,
      variables: { input: { phone: phoneNumber, code: authCode } },
    })

    if (data?.userLogin?.errors?.length > 0 || !data?.userLogin?.authToken) {
      throw new Error(data?.userLogin?.errors?.[0].message || "Something went wrong")
    }

    const galoyJwtToken = data?.userLogin?.authToken

    req.session = req.session || {}
    req.session.galoyJwtToken = galoyJwtToken

    return res.send({ galoyJwtToken })
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .send({ error: err instanceof Error ? err.message : "Something went wrong" })
  }
})

export default apiRouter
