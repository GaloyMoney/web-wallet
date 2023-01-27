import {
  MutationFunctionOptions,
  MutationHookOptions,
  MutationResult,
  useMutation as useApolloMutation,
} from "@apollo/client"
import { useCallback } from "react"

import { GaloyGQL, joinErrorsMessages } from "@/store/graphql//index"

import accountUpdateDefaultWalletId from "@/store/graphql//mutations/account-update-default-wallet-id"
import captchaCreateChallenge from "@/store/graphql//mutations/captcha-create-challenge"
import captchaRequestAuthCode from "@/store/graphql//mutations/captcha-request-auth-code"
import deviceNotificationTokenCreate from "@/store/graphql//mutations/device-notification-token-create"
import intraLedgerPaymentSend from "@/store/graphql//mutations/intra-ledger-paymest-send"
import intraLedgerUsdPaymentSend from "@/store/graphql//mutations/intra-ledger-usd-payment-send"
import lnInvoiceCreate from "@/store/graphql//mutations/ln-invoice-create"
import lnInvoiceCreateOnBehalfOfRecipient from "@/store/graphql//mutations/ln-invoice-create-on-behalf-of-recipient"
import lnInvoiceFeeProbe from "@/store/graphql//mutations/ln-invoice-fee-probe"
import lnInvoicePaymentSend from "@/store/graphql//mutations/ln-invoice-payment-send"
import lnNoAmountInvoiceCreate from "@/store/graphql//mutations/ln-no-amount-invoice-create"
import lnNoAmountInvoiceFeeProbe from "@/store/graphql//mutations/ln-no-amount-invoice-fee-probe"
import lnNoAmountInvoicePaymentSend from "@/store/graphql//mutations/ln-no-amount-invoice-payment-send"
import lnNoAmountUsdInvoiceFeeProbe from "@/store/graphql//mutations/ln-no-amount-usd-invoice-fee-probe"
import lnNoAmountUsdInvoicePaymentSend from "@/store/graphql//mutations/ln-no-amount-usd-invoice-payment-send"
import lnUsdInvoiceCreate from "@/store/graphql//mutations/ln-usd-invoice-create"
import lnUsdInvoiceCreateOnBehalfOfRecipient from "@/store/graphql//mutations/ln-usd-invoice-create-on-behalf-of-recipient"
import lnUsdInvoiceFeeProbe from "@/store/graphql//mutations/ln-usd-invoice-fee-probe"
import onChainAddressCurrent from "@/store/graphql//mutations/on-chain-address-current"
import onChainPaymentSend from "@/store/graphql//mutations/on-chain-payment-send"
import userContactUpdateAlias from "@/store/graphql//mutations/user-contact-update-alias"
import userLogin from "@/store/graphql//mutations/user-login"
import userQuizQuestionUpdateCompleted from "@/store/graphql//mutations/user-quiz-question-update-completed"
import userUpdateLanguage from "@/store/graphql//mutations/user-update-language"
import userUpdateUsername from "@/store/graphql//mutations/user-update-username"

export const MUTATIONS = {
  accountUpdateDefaultWalletId,
  captchaCreateChallenge,
  captchaRequestAuthCode,
  deviceNotificationTokenCreate,
  intraLedgerPaymentSend,
  intraLedgerUsdPaymentSend,
  lnInvoiceCreate,
  lnInvoiceCreateOnBehalfOfRecipient,
  lnInvoiceFeeProbe,
  lnInvoicePaymentSend,
  lnNoAmountInvoiceCreate,
  lnNoAmountInvoiceFeeProbe,
  lnNoAmountInvoicePaymentSend,
  lnNoAmountUsdInvoiceFeeProbe,
  lnNoAmountUsdInvoicePaymentSend,
  lnUsdInvoiceCreate,
  lnUsdInvoiceCreateOnBehalfOfRecipient,
  lnUsdInvoiceFeeProbe,
  onChainAddressCurrent,
  onChainPaymentSend,
  userContactUpdateAlias,
  userLogin,
  userQuizQuestionUpdateCompleted,
  userUpdateLanguage,
  userUpdateUsername,
}

type MutationHelpers = {
  errorsMessage?: string
}

const useMutationWrapper = <TData = unknown, TVars = unknown, TFunc = unknown>(
  mutationName: keyof typeof MUTATIONS,
  config?: MutationHookOptions<TData, TVars>,
): [TFunc, MutationResult<TData> & MutationHelpers] => {
  const [mutationFunction, result] = useApolloMutation<TData, TVars>(
    MUTATIONS[mutationName],
    config,
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = (result?.data as any)?.[mutationName]?.errors
  const errorsMessage = result?.error?.message || joinErrorsMessages(errors)

  const sendMutation = useCallback(
    async (options?: MutationFunctionOptions<TData, TVars>) => {
      const mutationResult = await mutationFunction(options)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mutationErrors = (mutationResult?.data as any)?.[mutationName]?.errors
      const mutationErrorsMessage =
        result?.error?.message || joinErrorsMessages(mutationErrors)
      return { ...mutationResult, errorsMessage: mutationErrorsMessage }
    },
    [mutationFunction, mutationName, result?.error?.message],
  )

  return [sendMutation as unknown as TFunc, { ...result, errorsMessage }]
}

type MutationFunction<TData, TVars> = (
  options?: MutationFunctionOptions<TData, TVars>,
) => Promise<MutationResult<TData> & MutationHelpers>

const defineMutation = <TData, TVars>(name: keyof typeof MUTATIONS) => {
  return (
    config?: MutationHookOptions<TData, TVars>,
  ): [MutationFunction<TData, TVars>, MutationResult<TData> & MutationHelpers] => {
    return useMutationWrapper<TData, TVars, MutationFunction<TData, TVars>>(name, config)
  }
}

const accountUpdateDefaultWalletIdMutation = defineMutation<
  GaloyGQL.AccountUpdateDefaultWalletIdMutation,
  GaloyGQL.AccountUpdateDefaultWalletIdMutationVariables
>("accountUpdateDefaultWalletId")

const captchaCreateChallengeMutation = defineMutation<
  GaloyGQL.CaptchaCreateChallengeMutation,
  GaloyGQL.CaptchaCreateChallengeMutationVariables
>("captchaCreateChallenge")

const captchaRequestAuthCodeMutation = defineMutation<
  GaloyGQL.CaptchaRequestAuthCodeMutation,
  GaloyGQL.CaptchaRequestAuthCodeMutationVariables
>("captchaRequestAuthCode")

const deviceNotificationTokenCreateMutation = defineMutation<
  GaloyGQL.DeviceNotificationTokenCreateMutation,
  GaloyGQL.DeviceNotificationTokenCreateMutationVariables
>("deviceNotificationTokenCreate")

const intraLedgerPaymentSendMutation = defineMutation<
  GaloyGQL.IntraLedgerPaymentSendMutation,
  GaloyGQL.IntraLedgerPaymentSendMutationVariables
>("intraLedgerPaymentSend")

const intraLedgerUsdPaymentSendMutation = defineMutation<
  GaloyGQL.IntraLedgerUsdPaymentSendMutation,
  GaloyGQL.IntraLedgerUsdPaymentSendMutationVariables
>("intraLedgerUsdPaymentSend")

const lnInvoiceCreateMutation = defineMutation<
  GaloyGQL.LnInvoiceCreateMutation,
  GaloyGQL.LnInvoiceCreateMutationVariables
>("lnInvoiceCreate")

const lnInvoiceCreateOnBehalfOfRecipientMutation = defineMutation<
  GaloyGQL.LnInvoiceCreateOnBehalfOfRecipientMutation,
  GaloyGQL.LnInvoiceCreateOnBehalfOfRecipientMutationVariables
>("lnInvoiceCreateOnBehalfOfRecipient")

const lnInvoiceFeeProbeMutation = defineMutation<
  GaloyGQL.LnInvoiceFeeProbeMutation,
  GaloyGQL.LnInvoiceFeeProbeMutationVariables
>("lnInvoiceFeeProbe")

const lnInvoicePaymentSendMutation = defineMutation<
  GaloyGQL.LnInvoicePaymentSendMutation,
  GaloyGQL.LnInvoicePaymentSendMutationVariables
>("lnInvoicePaymentSend")

const lnNoAmountInvoiceCreateMutation = defineMutation<
  GaloyGQL.LnNoAmountInvoiceCreateMutation,
  GaloyGQL.LnNoAmountInvoiceCreateMutationVariables
>("lnNoAmountInvoiceCreate")

const lnNoAmountInvoiceFeeProbeMutation = defineMutation<
  GaloyGQL.LnNoAmountInvoiceFeeProbeMutation,
  GaloyGQL.LnNoAmountInvoiceFeeProbeMutationVariables
>("lnNoAmountInvoiceFeeProbe")

const lnNoAmountInvoicePaymentSendMutation = defineMutation<
  GaloyGQL.LnNoAmountInvoicePaymentSendMutation,
  GaloyGQL.LnNoAmountInvoicePaymentSendMutationVariables
>("lnNoAmountInvoicePaymentSend")

const lnNoAmountUsdInvoiceFeeProbeMutation = defineMutation<
  GaloyGQL.LnNoAmountUsdInvoiceFeeProbeMutation,
  GaloyGQL.LnNoAmountUsdInvoiceFeeProbeMutationVariables
>("lnNoAmountUsdInvoiceFeeProbe")

const lnNoAmountUsdInvoicePaymentSendMutation = defineMutation<
  GaloyGQL.LnNoAmountUsdInvoicePaymentSendMutation,
  GaloyGQL.LnNoAmountUsdInvoicePaymentSendMutationVariables
>("lnNoAmountUsdInvoicePaymentSend")

const lnUsdInvoiceCreateMutation = defineMutation<
  GaloyGQL.LnUsdInvoiceCreateMutation,
  GaloyGQL.LnUsdInvoiceCreateMutationVariables
>("lnUsdInvoiceCreate")

const lnUsdInvoiceCreateOnBehalfOfRecipientMutation = defineMutation<
  GaloyGQL.LnUsdInvoiceCreateOnBehalfOfRecipientMutation,
  GaloyGQL.LnUsdInvoiceCreateOnBehalfOfRecipientMutationVariables
>("lnUsdInvoiceCreateOnBehalfOfRecipient")

const lnUsdInvoiceFeeProbeMutation = defineMutation<
  GaloyGQL.LnUsdInvoiceFeeProbeMutation,
  GaloyGQL.LnUsdInvoiceFeeProbeMutationVariables
>("lnUsdInvoiceFeeProbe")

const onChainAddressCurrentMutation = defineMutation<
  GaloyGQL.OnChainAddressCurrentMutation,
  GaloyGQL.OnChainAddressCurrentMutationVariables
>("onChainAddressCurrent")

const onChainPaymentSendMutation = defineMutation<
  GaloyGQL.OnChainPaymentSendMutation,
  GaloyGQL.OnChainPaymentSendMutationVariables
>("onChainPaymentSend")

const userContactUpdateAliasMutation = defineMutation<
  GaloyGQL.UserContactUpdateAliasMutation,
  GaloyGQL.UserContactUpdateAliasMutationVariables
>("userContactUpdateAlias")

const userLoginMutation = defineMutation<
  GaloyGQL.UserLoginMutation,
  GaloyGQL.UserLoginMutationVariables
>("userLogin")

const userQuizQuestionUpdateCompletedMutation = defineMutation<
  GaloyGQL.UserQuizQuestionUpdateCompletedMutation,
  GaloyGQL.UserQuizQuestionUpdateCompletedMutationVariables
>("userQuizQuestionUpdateCompleted")

const userUpdateLanguageMutation = defineMutation<
  GaloyGQL.UserUpdateLanguageMutation,
  GaloyGQL.UserUpdateLanguageMutationVariables
>("userUpdateLanguage")

const userUpdateUsernameMutation = defineMutation<
  GaloyGQL.UserUpdateUsernameMutation,
  GaloyGQL.UserUpdateUsernameMutationVariables
>("userUpdateUsername")

export const useMutation = {
  accountUpdateDefaultWalletId: accountUpdateDefaultWalletIdMutation,
  captchaCreateChallenge: captchaCreateChallengeMutation,
  captchaRequestAuthCode: captchaRequestAuthCodeMutation,
  deviceNotificationTokenCreate: deviceNotificationTokenCreateMutation,
  intraLedgerPaymentSend: intraLedgerPaymentSendMutation,
  intraLedgerUsdPaymentSend: intraLedgerUsdPaymentSendMutation,
  lnInvoiceCreate: lnInvoiceCreateMutation,
  lnInvoiceCreateOnBehalfOfRecipient: lnInvoiceCreateOnBehalfOfRecipientMutation,
  lnInvoiceFeeProbe: lnInvoiceFeeProbeMutation,
  lnInvoicePaymentSend: lnInvoicePaymentSendMutation,
  lnNoAmountInvoiceCreate: lnNoAmountInvoiceCreateMutation,
  lnNoAmountInvoiceFeeProbe: lnNoAmountInvoiceFeeProbeMutation,
  lnNoAmountInvoicePaymentSend: lnNoAmountInvoicePaymentSendMutation,
  lnNoAmountUsdInvoiceFeeProbe: lnNoAmountUsdInvoiceFeeProbeMutation,
  lnNoAmountUsdInvoicePaymentSend: lnNoAmountUsdInvoicePaymentSendMutation,
  lnUsdInvoiceCreate: lnUsdInvoiceCreateMutation,
  lnUsdInvoiceCreateOnBehalfOfRecipient: lnUsdInvoiceCreateOnBehalfOfRecipientMutation,
  lnUsdInvoiceFeeProbe: lnUsdInvoiceFeeProbeMutation,
  onChainAddressCurrent: onChainAddressCurrentMutation,
  onChainPaymentSend: onChainPaymentSendMutation,
  userContactUpdateAlias: userContactUpdateAliasMutation,
  userLogin: userLoginMutation,
  userQuizQuestionUpdateCompleted: userQuizQuestionUpdateCompletedMutation,
  userUpdateLanguage: userUpdateLanguageMutation,
  userUpdateUsername: userUpdateUsernameMutation,
}
