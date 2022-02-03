import { NextFunction, Request, Response } from "express"
import kratosSdk from "./config"

export const requireNoAuth = (req: Request, res: Response, next: NextFunction) => {
  kratosSdk
    .toSession(undefined, req.header("cookie"))
    .then(() => {
      res.redirect("/")
    })
    .catch(() => {
      next()
    })
}
