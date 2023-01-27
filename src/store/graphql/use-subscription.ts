/* eslint-disable react-hooks/rules-of-hooks */
import {
  useSubscription as useApolloSubscription,
  SubscriptionHookOptions,
  SubscriptionResult,
} from "@apollo/client"

import { GaloyGQL, joinErrorsMessages } from "@/store/graphql/index"

import myUpdates from "@/store/graphql/subscriptions/my-updates"
import lnInvoicePaymentStatus from "@/store/graphql/subscriptions/ln-invoice-payment-status"

export const SUBSCRIPTIONS = {
  myUpdates,
  lnInvoicePaymentStatus,
}

type SubscriptionHelpers = {
  errorsMessage?: string
}

const useSubscriptionWrapper = <TData = unknown, TVars = unknown>(
  subscriptionName: keyof typeof SUBSCRIPTIONS,
  config?: SubscriptionHookOptions<TData, TVars>,
): SubscriptionResult<TData> & SubscriptionHelpers => {
  const result = useApolloSubscription<TData, TVars>(
    SUBSCRIPTIONS[subscriptionName],
    config,
  )

  const { data, error } = result
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = (data as any)?.[subscriptionName]?.errors
  const errorsMessage = error?.message || joinErrorsMessages(errors)

  return { ...result, errorsMessage }
}

const myUpdatesSubscription = (
  config?: SubscriptionHookOptions<
    GaloyGQL.MyUpdatesSubscription,
    GaloyGQL.MyUpdatesSubscriptionVariables
  >,
): SubscriptionResult<GaloyGQL.MyUpdatesSubscription> & SubscriptionHelpers => {
  return useSubscriptionWrapper<
    GaloyGQL.MyUpdatesSubscription,
    GaloyGQL.MyUpdatesSubscriptionVariables
  >("myUpdates", config)
}

const lnInvoicePaymentStatusSubscription = (
  config?: SubscriptionHookOptions<
    GaloyGQL.LnInvoicePaymentStatusSubscription,
    GaloyGQL.LnInvoicePaymentStatusSubscriptionVariables
  >,
): SubscriptionResult<GaloyGQL.LnInvoicePaymentStatusSubscription> &
  SubscriptionHelpers => {
  return useSubscriptionWrapper<
    GaloyGQL.LnInvoicePaymentStatusSubscription,
    GaloyGQL.LnInvoicePaymentStatusSubscriptionVariables
  >("lnInvoicePaymentStatus", config)
}

export const useSubscription = {
  myUpdates: myUpdatesSubscription,
  lnInvoicePaymentStatus: lnInvoicePaymentStatusSubscription,
}
