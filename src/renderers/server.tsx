import { Request } from "express"
import { renderToStringWithData } from "@galoymoney/client"

import config from "store/config"
import { createClient } from "store/index"
import { appRoutes, authRoutes } from "server/routes"

import { SSRRoot } from "components/root"

type ServerRenderResponse = {
  GwwState: GwwState
  GwwConfig: Record<string, string | boolean | number>
  initialMarkup: string
  ssrData: unknown
  pageData: Record<string, unknown>
}

const allowedProps = {
  flow: ["/login", "/register", "/recovery", "/settings", "/verification"],
  to: ["/send"],
  username: ["/transactions"],
}

type AllowedProp = keyof typeof allowedProps
type PropValue = number | boolean | string | undefined

const extractAllowedProps = ({
  path,
  props,
}: {
  path: string
  props: Record<string, PropValue | unknown>
}): Record<AllowedProp, PropValue> => {
  return Object.entries(props).reduce((acc, prop) => {
    const [propKey, propValue] = prop
    if (propKey in allowedProps && allowedProps[propKey as AllowedProp].includes(path)) {
      if (["number", "boolean", "string"].includes(typeof propValue)) {
        acc[propKey as AllowedProp] = propValue as PropValue
      }
    }
    return acc
  }, {} as Record<AllowedProp, PropValue>)
}

export const serverRenderer =
  (req: Request) =>
  async ({
    path,
    flowData,
  }: {
    path: RoutePath | AuthRoutePath
    flowData?: KratosFlowData
  }): Promise<Error | ServerRenderResponse> => {
    try {
      const galoyJwtToken = req.session?.authSession?.galoyJwtToken

      const GwwState: GwwState = {
        path,
        props: extractAllowedProps({ path, props: req.query }),
        key: 0,
        sessionUserId: req.session?.authSession?.identity?.userId,
        defaultLanguage: req.acceptsLanguages()?.[0],
        flowData,
      }

      const galoyClient = createClient({
        authToken: galoyJwtToken,
        headers: req.headers,
      })
      const App = (
        <SSRRoot
          client={galoyClient}
          GwwState={GwwState}
          galoyJwtToken={galoyJwtToken}
          flowData={flowData}
        />
      )

      const initialMarkup = await renderToStringWithData(App)
      const ssrData = galoyClient.extract()

      const {
        walletName,
        walletTheme,
        supportEmail,
        shareUri,
        graphqlUri,
        graphqlSubscriptionUri,
        network,
        authEndpoint,
        kratosFeatureFlag,
        kratosBrowserUrl,
        kratosAuthEndpoint,
      } = config

      return Promise.resolve({
        GwwState,
        GwwConfig: {
          walletName,
          walletTheme,
          supportEmail,
          shareUri,
          graphqlUri,
          graphqlSubscriptionUri,
          network,
          authEndpoint,
          kratosFeatureFlag,
          kratosBrowserUrl,
          kratosAuthEndpoint,
        },
        initialMarkup,
        ssrData,
        pageData:
          flowData === undefined
            ? appRoutes[path as RoutePath]
            : authRoutes[path as AuthRoutePath],
      })
    } catch (err) {
      console.error(err)
    }
  }
