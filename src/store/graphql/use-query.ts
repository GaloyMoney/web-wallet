/* eslint-disable react-hooks/rules-of-hooks */
import {
  QueryResult,
  QueryHookOptions,
  useApolloClient,
  useQuery as useApolloQuery,
  QueryOptions,
} from "@apollo/client"
import { useCallback, useState } from "react"

import accountDefaultWallet from "@/store/graphql/queries/account-default-wallet"
import btcPriceList from "@/store/graphql/queries/btc-price-list"
import businessMapMarkers from "@/store/graphql/queries/business-map-markers"
import contacts from "@/store/graphql/queries/contacts"
import getWalletCsvTransactions from "@/store/graphql/queries/get-wallet-csv-transactions"
import main from "@/store/graphql/queries/main"
import onChainTxFee from "@/store/graphql/queries/on-chain-tx-fee"
import quizQuestions from "@/store/graphql/queries/quiz-questions"
import transactionList from "@/store/graphql/queries/transaction-list"
import transactionListForContact from "@/store/graphql/queries/transaction-list-for-contact"
import transactionListForDefaultAccount from "@/store/graphql/queries/transaction-list-for-default-account"
import userDefaultWalletId from "@/store/graphql/queries/user-default-wallet-id"
import usernameAvailable from "@/store/graphql/queries/username-available"
import currencyList from "@/store/graphql/queries/currency-list"

import { GaloyGQL, joinErrorsMessages } from "@/store/graphql/index"

export const QUERIES = {
  accountDefaultWallet,
  btcPriceList,
  businessMapMarkers,
  contacts,
  getWalletCsvTransactions,
  main,
  onChainTxFee,
  quizQuestions,
  transactionList,
  transactionListForContact,
  transactionListForDefaultAccount,
  userDefaultWalletId,
  usernameAvailable,
  currencyList,
}

type QueryHelpers = {
  errorsMessage?: string
}

const useQueryWrapper = <TData = unknown, TVars = unknown>(
  queryName: keyof typeof QUERIES,
  config?: QueryHookOptions<TData, TVars>,
): QueryResult<TData, TVars> & QueryHelpers => {
  const result = useApolloQuery<TData, TVars>(QUERIES[queryName], config)

  const { data, error } = result
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = (data as any)?.[queryName]?.errors
  const errorsMessage = error?.message || joinErrorsMessages(errors)

  return { ...result, errorsMessage }
}

const onChainTxFeeQuery = (
  config?: QueryHookOptions<
    GaloyGQL.OnChainTxFeeQuery,
    GaloyGQL.OnChainTxFeeQueryVariables
  >,
): QueryResult<GaloyGQL.OnChainTxFeeQuery, GaloyGQL.OnChainTxFeeQueryVariables> &
  QueryHelpers => {
  return useQueryWrapper<GaloyGQL.OnChainTxFeeQuery, GaloyGQL.OnChainTxFeeQueryVariables>(
    "onChainTxFee",
    config,
  )
}

const mainQuery = (
  config?: QueryHookOptions<GaloyGQL.MainQuery, GaloyGQL.MainQueryVariables>,
): QueryResult<GaloyGQL.MainQuery, GaloyGQL.MainQueryVariables> & QueryHelpers => {
  return useQueryWrapper<GaloyGQL.MainQuery, GaloyGQL.MainQueryVariables>("main", config)
}

const accountDefaultWalletQuery = (
  config?: QueryHookOptions<
    GaloyGQL.AccountDefaultWalletQuery,
    GaloyGQL.AccountDefaultWalletQueryVariables
  >,
): QueryResult<
  GaloyGQL.AccountDefaultWalletQuery,
  GaloyGQL.AccountDefaultWalletQueryVariables
> &
  QueryHelpers => {
  return useQueryWrapper<
    GaloyGQL.AccountDefaultWalletQuery,
    GaloyGQL.AccountDefaultWalletQueryVariables
  >("accountDefaultWallet", config)
}

const transactionListQuery = (
  config?: QueryHookOptions<
    GaloyGQL.TransactionListQuery,
    GaloyGQL.TransactionListQueryVariables
  >,
): QueryResult<GaloyGQL.TransactionListQuery> & QueryHelpers => {
  return useQueryWrapper<
    GaloyGQL.TransactionListQuery,
    GaloyGQL.TransactionListQueryVariables
  >("transactionList", config)
}

const transactionListForDefaultAccountQuery = (
  config?: QueryHookOptions<
    GaloyGQL.TransactionListForDefaultAccountQuery,
    GaloyGQL.TransactionListForDefaultAccountQueryVariables
  >,
): QueryResult<GaloyGQL.TransactionListForDefaultAccountQuery> & QueryHelpers => {
  return useQueryWrapper<
    GaloyGQL.TransactionListForDefaultAccountQuery,
    GaloyGQL.TransactionListForDefaultAccountQueryVariables
  >("transactionListForDefaultAccount", config)
}

const contactsQuery = (
  config?: QueryHookOptions<GaloyGQL.ContactsQuery, GaloyGQL.ContactsQueryVariables>,
): QueryResult<GaloyGQL.ContactsQuery, GaloyGQL.ContactsQueryVariables> &
  QueryHelpers => {
  return useQueryWrapper<GaloyGQL.ContactsQuery, GaloyGQL.ContactsQueryVariables>(
    "contacts",
    config,
  )
}

const transactionListForContactQuery = (
  config?: QueryHookOptions<
    GaloyGQL.TransactionListForContactQuery,
    GaloyGQL.TransactionListForContactQueryVariables
  >,
): QueryResult<
  GaloyGQL.TransactionListForContactQuery,
  GaloyGQL.TransactionListForContactQueryVariables
> &
  QueryHelpers => {
  return useQueryWrapper<
    GaloyGQL.TransactionListForContactQuery,
    GaloyGQL.TransactionListForContactQueryVariables
  >("transactionListForContact", config)
}

export const useQuery = {
  accountDefaultWallet: accountDefaultWalletQuery,
  contacts: contactsQuery,
  main: mainQuery,
  onChainTxFee: onChainTxFeeQuery,
  transactionList: transactionListQuery,
  transactionListForContact: transactionListForContactQuery,
  transactionListForDefaultAccount: transactionListForDefaultAccountQuery,
}

// ********** DELAYED QUERIES ********** //

const useDelayedQueryWrapper = <TData = unknown, TVars = unknown>(
  queryName: keyof typeof QUERIES,
  config?: Omit<QueryOptions<TVars, TData>, "query" | "variables">,
): [
  (variables?: TVars) => Promise<QueryResult<TData> & QueryHelpers>,
  { loading: boolean },
] => {
  const client = useApolloClient()
  const [loading, setLoading] = useState<boolean>(false)

  const sendQuery = useCallback(
    async (variables: TVars) => {
      setLoading(true)
      try {
        const result = await client.query({
          query: QUERIES[queryName],
          variables,
          ...config,
        })
        setLoading(false)
        const { data, error } = result
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errors = (data as any)?.[queryName]?.errors
        const errorsMessage = error?.message || joinErrorsMessages(errors)

        return { ...result, loading, errorsMessage }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setLoading(false)
        return Promise.resolve({
          networkStatus: "ERROR",
          data: undefined,
          error: err,
          loading,
          errorsMessage: err?.message || "Something went wrong",
        })
      }
    },
    [client, config, loading, queryName],
  )

  return [
    sendQuery as unknown as (
      variables?: TVars,
    ) => Promise<QueryResult<TData> & QueryHelpers>,
    { loading },
  ]
}

const userDefaultWalletIdDelayedQuery = (
  config?: QueryOptions<
    GaloyGQL.UserDefaultWalletIdQuery,
    GaloyGQL.UserDefaultWalletIdQueryVariables
  >,
) => {
  return useDelayedQueryWrapper<
    GaloyGQL.UserDefaultWalletIdQuery,
    GaloyGQL.UserDefaultWalletIdQueryVariables
  >("userDefaultWalletId", config)
}

const accountDefaultWalletDelayedQuery = (
  config?: QueryOptions<
    GaloyGQL.AccountDefaultWalletQuery,
    GaloyGQL.AccountDefaultWalletQueryVariables
  >,
) => {
  return useDelayedQueryWrapper<
    GaloyGQL.AccountDefaultWalletQuery,
    GaloyGQL.AccountDefaultWalletQueryVariables
  >("accountDefaultWallet", config)
}

const contactsDelayedQuery = (
  config?: QueryOptions<GaloyGQL.ContactsQuery, GaloyGQL.ContactsQueryVariables>,
) => {
  return useDelayedQueryWrapper<GaloyGQL.ContactsQuery, GaloyGQL.ContactsQueryVariables>(
    "contacts",
    config,
  )
}

const transactionListDelayedQuery = (
  config?: QueryOptions<
    GaloyGQL.TransactionListQuery,
    GaloyGQL.TransactionListQueryVariables
  >,
) => {
  return useDelayedQueryWrapper<
    GaloyGQL.TransactionListQuery,
    GaloyGQL.TransactionListQueryVariables
  >("transactionList", config)
}

const transactionListForContactDelayedQuery = (
  config?: QueryOptions<
    GaloyGQL.TransactionListForContactQuery,
    GaloyGQL.TransactionListForContactQueryVariables
  >,
) => {
  return useDelayedQueryWrapper<
    GaloyGQL.TransactionListForContactQuery,
    GaloyGQL.TransactionListForContactQueryVariables
  >("transactionListForContact", config)
}

const onChainTxFeeDelayedQuery = (
  config?: QueryOptions<GaloyGQL.OnChainTxFeeQuery, GaloyGQL.OnChainTxFeeQueryVariables>,
) => {
  return useDelayedQueryWrapper<
    GaloyGQL.OnChainTxFeeQuery,
    GaloyGQL.OnChainTxFeeQueryVariables
  >("onChainTxFee", config)
}

export const useDelayedQuery = {
  accountDefaultWallet: accountDefaultWalletDelayedQuery,
  onChainTxFee: onChainTxFeeDelayedQuery,
  transactionList: transactionListDelayedQuery,
  transactionListForContact: transactionListForContactDelayedQuery,
  userDefaultWalletId: userDefaultWalletIdDelayedQuery,
  contacts: contactsDelayedQuery,
}
