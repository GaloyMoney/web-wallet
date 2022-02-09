import { Configuration } from "@ory/client"
import { NextFunction, Response } from "express"
import { V0alpha2ApiInterface, V0alpha2Api } from "@ory/kratos-client"

const kratosApiBaseUrlInternal = process.env.KRATOS_API_BASE_URL as string

export const kratosBrowserUrl = process.env.KRATOS_BROWSER_URL as string

const kratosSdk: V0alpha2ApiInterface = new V0alpha2Api(
  new Configuration({ basePath: kratosApiBaseUrlInternal }),
) as unknown as V0alpha2ApiInterface

export default kratosSdk

export interface KratosValues {
  kratosSdk: V0alpha2ApiInterface
  apiBaseUrl: string
  kratosBrowserUrl: string
  baseUrlWithoutTrailingSlash?: string
}

export const kratosValues: KratosValues = {
  kratosBrowserUrl,
  apiBaseUrl: kratosBrowserUrl,
  kratosSdk,
}

export const isQuerySet = (x: any): x is string => typeof x === "string" && x.length > 0
export const removeTrailingSlash = (str: string) => str.replace(/\/$/, "")

export const getUrlForFlow = (base: string, flow: string, query?: URLSearchParams) =>
  `${removeTrailingSlash(base)}/self-service/${flow}/browser${
    query ? `?${query.toString()}` : ""
  }`

// export const redirectOnSoftError =
//   (res: Response, next: NextFunction, redirectTo: string) => (err: AxiosError) => {
//     console.log("redirectOnSoftError", err)
//     if (!err.response) {
//       next(err)
//       return
//     }

//     if (
//       err.response.status === 404 ||
//       err.response.status === 410 ||
//       err.response.status === 403
//     ) {
//       res.redirect(`${redirectTo}`)
//       return
//     }

//     next(err)
//   }
