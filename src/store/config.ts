import { Network } from "@galoymoney/client"

import { GwwConfigType } from "@/store/types"

const isBrowser = typeof window !== "undefined"

if (!isBrowser) {
  if (
    process.env.NEXT_PUBLIC_NETWORK &&
    !["mainnet", "testnet", "signet", "regtest"].includes(process.env.NEXT_PUBLIC_NETWORK)
  ) {
    throw new Error("Invalid NETWORK value")
  }
}

export type configType = GwwConfigType & {
  isBrowser?: boolean
  isDev?: boolean
  sessionKeys?: string
  host?: string
  port?: number
}

export const config: configType = isBrowser
  ? { isBrowser, ...window.__NEXT_DATA__.props.pageProps.publicConfig }
  : {
      isDev: process.env.NODE_ENV !== "production",
      isBrowser,
      walletName: process.env.NEXT_PUBLIC_WALLET_NAME as string,
      shareUrl: process.env.NEXT_PUBLIC_SHARE_URL as string,
      sessionKeys: process.env.SESSION_KEYS as string,
      host: process.env.HOST as string,
      port: Number(process.env.PORT),
      supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL as string,
      network: process.env.NEXT_PUBLIC_NETWORK as Network,
      graphqlUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
      graphqlSubscriptionUrl: process.env.NEXT_PUBLIC_GRAPHQL_SUBSCRIPTION_URL as string,

      authEndpoint: process.env.NEXT_PUBLIC_AUTH_ENDPOINT as string,
      kratosFeatureFlag: Boolean(
        process.env.NEXT_PUBLIC_KRATOS_FEATURE_FLAG === "true" || false,
      ),
      kratosBrowserUrl: process.env.NEXT_PUBLIC_KRATOS_BROWSER_URL as string,
      galoyAuthEndpoint: process.env.NEXT_PUBLIC_GALOY_AUTH_ENDPOINT as string,
    }

const publicConfigKeys = [
  "walletName",
  "supportEmail",
  "shareUrl",
  "graphqlUrl",
  "graphqlSubscriptionUrl",
  "network",
  "authEndpoint",
  "kratosFeatureFlag",
  "kratosBrowserUrl",
  "galoyAuthEndpoint",
] as const

export const publicConfig = Object.fromEntries(
  publicConfigKeys.map((key) => [key, config[key]]),
)
