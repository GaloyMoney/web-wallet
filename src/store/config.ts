import { Network } from "@galoymoney/client"
import { GwwConfigType } from "./types"

const isBrowser = typeof window !== "undefined"

if (!isBrowser) {
  const requiredEnvVars = [
    "NODE_ENV",
    "NODE_PATH",
    "SESSION_KEYS",
    "WALLET_NAME",
    "WALLET_THEME",
    "SHARE_URI",
    "HOST",
    "PORT",
    "SUPPORT_EMAIL",
    "GRAPHQL_URI",
    "GRAPHQL_SUBSCRIPTION_URI",
    "AUTH_ENDPOINT",
  ]

  if (process.env.KRATOS_FEATURE_FLAG === "true") {
    requiredEnvVars.push("KRATOS_API_URL", "KRATOS_BROWSER_URL", "GALOY_AUTH_ENDPOINT")
  }

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Missing env var: ${envVar}`)
    }
  })

  if (
    process.env.NETWORK &&
    !["mainnet", "testnet", "regtest"].includes(process.env.NETWORK)
  ) {
    throw new Error("Invalid NETWORK value")
  }
}

const networkMap = (graphqlUri: string): Network => {
  if (graphqlUri.match("mainnet")) {
    return "mainnet"
  }

  if (graphqlUri.match("testnet")) {
    return "testnet"
  }

  return "regtest"
}

export type configType = GwwConfigType & {
  isBrowser?: boolean
  isDev?: boolean
  sessionKeys?: string
  host?: string
  port?: number
}

const config: configType = isBrowser
  ? { isBrowser, ...window.__G_DATA.GwwConfig }
  : {
      isDev: process.env.NODE_ENV !== "production",
      isBrowser,
      walletName: process.env.WALLET_NAME as string,
      walletTheme: process.env.WALLET_THEME as string,
      shareUri: process.env.SHARE_URI as string,
      sessionKeys: process.env.SESSION_KEYS as string,
      host: process.env.HOST as string,
      port: Number(process.env.PORT),
      supportEmail: process.env.SUPPORT_EMAIL as string,
      network:
        (process.env.NETWORK as Network) ?? networkMap(process.env.GRAPHQL_URI as string),
      graphqlUri: process.env.GRAPHQL_URI as string,
      graphqlSubscriptionUri: process.env.GRAPHQL_SUBSCRIPTION_URI as string,

      authEndpoint: process.env.AUTH_ENDPOINT as string,
      kratosFeatureFlag: Boolean(process.env.KRATOS_FEATURE_FLAG === "true" || false),
      kratosBrowserUrl: process.env.KRATOS_BROWSER_URL as string,
      galoyAuthEndpoint: process.env.GALOY_AUTH_ENDPOINT as string,
    }

const publicConfigKeys = [
  "walletName",
  "walletTheme",
  "supportEmail",
  "shareUri",
  "graphqlUri",
  "graphqlSubscriptionUri",
  "network",
  "authEndpoint",
  "kratosFeatureFlag",
  "kratosBrowserUrl",
  "galoyAuthEndpoint",
] as const

export const publicConfig = Object.fromEntries(
  publicConfigKeys.map((key) => [key, config[key]]),
)

export default config
