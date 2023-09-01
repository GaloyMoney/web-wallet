import { GaloyGQL, PriceCacheStore } from "@galoymoney/client"
import { useMemo, useRef } from "react"

import useMainQuery from "hooks/use-main-query"
import { gql } from "@apollo/client"
import { LnUpdate, useMyUpdatesSubscription } from "graphql/generated"

export type PriceData = {
  formattedAmount: string
  base: number
  offset: number
  currencyUnit: string
}

const satPriceInCents = (update: PriceData | undefined) => {
  if (!update) {
    return NaN
  }
  const { base, offset } = update
  return base / 10 ** offset
}

type UseMyUpdates = {
  usdPerBtc: number | null
  satsToUsd: ((sats: number) => number) | null
  usdToSats: ((usd: number) => number) | null
  currentBalance: number | null
  intraLedgerUpdate: Partial<GaloyGQL.IntraLedgerUpdate> | null
  lnUpdate: Partial<LnUpdate> | null
  onChainUpdate: Partial<GaloyGQL.OnChainUpdate> | null
}

gql`
  subscription myUpdates($recentTransactions: Int = 5) {
    myUpdates {
      errors {
        message
        __typename
      }
      me {
        ...Me
        __typename
      }
      update {
        type: __typename
        ... on Price {
          base
          offset
          currencyUnit
          formattedAmount
          __typename
        }
        ... on LnUpdate {
          walletId
          paymentHash
          status
          __typename
        }
        ... on OnChainUpdate {
          walletId
          txNotificationType
          txHash
          amount
          displayCurrencyPerSat
          __typename
        }
        ... on IntraLedgerUpdate {
          walletId
          txNotificationType
          amount
          displayCurrencyPerSat
          __typename
        }
      }
      __typename
    }
  }
  fragment Me on User {
    id
    language
    username
    phone
    defaultAccount {
      id
      defaultWalletId
      transactions(first: $recentTransactions) {
        ...TransactionList
        __typename
      }
      wallets {
        id
        balance
        walletCurrency
        __typename
      }
      __typename
    }
    __typename
  }
  fragment TransactionList on TransactionConnection {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
      __typename
    }
    edges {
      cursor
      node {
        __typename
        id
        status
        direction
        memo
        createdAt
        settlementAmount
        settlementFee
        settlementCurrency
        settlementPrice {
          base
          offset
          currencyUnit
          formattedAmount
          __typename
        }
        initiationVia {
          __typename
          ... on InitiationViaIntraLedger {
            counterPartyWalletId
            counterPartyUsername
            __typename
          }
          ... on InitiationViaLn {
            paymentHash
            __typename
          }
          ... on InitiationViaOnChain {
            address
            __typename
          }
        }
        settlementVia {
          __typename
          ... on SettlementViaIntraLedger {
            counterPartyWalletId
            counterPartyUsername
            __typename
          }
          ... on SettlementViaLn {
            paymentSecret
            __typename
          }
          ... on SettlementViaOnChain {
            transactionHash
            __typename
          }
        }
      }
      __typename
    }
    __typename
  }
`

const useMyUpdates = (): UseMyUpdates => {
  const intraLedgerUpdate = useRef<Partial<GaloyGQL.IntraLedgerUpdate> | null>(null)
  const lnUpdate = useRef<Partial<LnUpdate> | null>(null)
  const onChainUpdate = useRef<Partial<GaloyGQL.OnChainUpdate> | null>(null)

  const priceCacheStore = PriceCacheStore()
  const { btcPrice } = useMainQuery()

  const cachedPrice = useRef(priceCacheStore.read() ?? NaN)

  const updatePriceCache = (newPrice: number): void => {
    if (cachedPrice.current !== newPrice) {
      priceCacheStore.write(newPrice)
      cachedPrice.current = newPrice
    }
  }

  const { data } = useMyUpdatesSubscription({
    variables: {
      recentTransactions: 5,
    },
  })

  if (Number.isNaN(cachedPrice.current) && btcPrice) {
    updatePriceCache(satPriceInCents(btcPrice))
  }

  if (data?.myUpdates?.update) {
    const { type } = data.myUpdates.update
    if (type === "Price") {
      updatePriceCache(satPriceInCents(data.myUpdates.update))
    }
    if (type === "IntraLedgerUpdate") {
      intraLedgerUpdate.current = data.myUpdates.update
    }
    if (type === "LnUpdate") {
      lnUpdate.current = data.myUpdates.update
    }
    if (type === "OnChainUpdate") {
      onChainUpdate.current = data.myUpdates.update
    }
  }

  const currentBalance = data?.myUpdates?.me?.defaultAccount?.wallets?.[0]?.balance ?? NaN

  // The following variables have to be defined here as they depend on cachedPrice.current

  const usdPerBtc = useMemo(() => {
    return Number.isNaN(cachedPrice.current)
      ? null
      : (cachedPrice.current * 100_000_000) / 100
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedPrice.current])

  const satsToUsd = useMemo(() => {
    return Number.isNaN(cachedPrice.current)
      ? null
      : (sats: number) => (sats * cachedPrice.current) / 100
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedPrice.current])

  const usdToSats = useMemo(() => {
    return Number.isNaN(cachedPrice.current)
      ? null
      : (usd: number) => (100 * usd) / cachedPrice.current
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedPrice.current])

  return {
    usdPerBtc,
    satsToUsd,
    usdToSats,
    currentBalance,
    intraLedgerUpdate: intraLedgerUpdate.current,
    lnUpdate: lnUpdate.current,
    onChainUpdate: onChainUpdate.current,
  }
}

export default useMyUpdates
