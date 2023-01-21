import { gql, useApolloClient } from "@apollo/client"
import { GaloyGQL } from "./types"

const joinErrorsMessages = (errors?: Array<GaloyGQL.Error>) => {
  return errors?.map((err) => err.message).join(", ")
}

const CACHED_DATA = gql`
  query cachedData {
    satPriceInCents @client
  }
`
export type CachedData = {
  satPriceInCents: number
}

export const PriceCacheStore = () => {
  const client = useApolloClient()
  return {
    read: () => {
      const cachedData = client.readQuery<CachedData>({ query: CACHED_DATA })
      return cachedData?.satPriceInCents
    },
    write: (newPrice: number) =>
      client.writeQuery({ query: CACHED_DATA, data: { satPriceInCents: newPrice } }),
  }
}

export { GaloyGQL, joinErrorsMessages }

export * from "./use-query"
export * from "./use-mutation"
export * from "./use-subscription"
