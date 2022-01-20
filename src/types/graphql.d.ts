declare namespace GraphQL {
type Maybe<T> = T | null;
type InputMaybe<T> = Maybe<T>;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Identifier of an account api key */
  AccountApiKeyLabel: string;
  /** An authentication code valid for a single use */
  AuthToken: string;
  /** An alias name that a user can set for a wallet (with which they have transactions) */
  ContactAlias: string;
  /** Hex-encoded string of 32 bytes */
  Hex32Bytes: string;
  Language: string;
  LnPaymentPreImage: string;
  /** BOLT11 lightning invoice payment request with the amount included */
  LnPaymentRequest: string;
  LnPaymentSecret: string;
  /** Text field in a lightning payment transaction */
  Memo: string;
  /** An address for an on-chain bitcoin destination */
  OnChainAddress: string;
  OnChainTxHash: string;
  /** An authentication code valid for a single use */
  OneTimeAuthCode: string;
  PaymentHash: string;
  /** Phone number which includes country code */
  Phone: string;
  /** Non-fractional signed whole numeric value between -(2^53) + 1 and 2^53 - 1 */
  SafeInt: number;
  /** (Positive) Satoshi amount (i.g. quiz earning) */
  SatAmount: number;
  /** An amount (of a currency) that can be negative (i.g. in a transaction) */
  SignedAmount: number;
  /** (Positive) Number of blocks in which the transaction is expected to be confirmed */
  TargetConfirmations: number;
  /** Timestamp field, serialized as Unix time (the number of seconds since the Unix epoch) */
  Timestamp: number;
  /** Unique identifier of a user */
  Username: string;
  /** Unique identifier of a wallet */
  WalletId: string;
};

type Account = {
  csvTransactions: Scalars['String'];
  defaultWalletId: Scalars['WalletId'];
  id: Scalars['ID'];
  wallets: Array<Wallet>;
};


type AccountCsvTransactionsArgs = {
  walletIds: Array<Scalars['WalletId']>;
};

type AccountApiKey = {
  __typename?: 'AccountApiKey';
  expireAt: Scalars['Timestamp'];
  key: Scalars['String'];
  label: Scalars['AccountApiKeyLabel'];
  secret: Scalars['String'];
};

type AccountApiKeyCreateInput = {
  expireAt: Scalars['Timestamp'];
  label?: InputMaybe<Scalars['AccountApiKeyLabel']>;
};

type AccountApiKeyDisableInput = {
  label: Scalars['AccountApiKeyLabel'];
};

type AccountApiKeyHashed = {
  __typename?: 'AccountApiKeyHashed';
  expireAt: Scalars['Timestamp'];
  label: Scalars['AccountApiKeyLabel'];
};

type AccountApiKeyPayload = {
  __typename?: 'AccountApiKeyPayload';
  accountApiKey?: Maybe<AccountApiKey>;
  errors: Array<Error>;
};

type AuthTokenPayload = {
  __typename?: 'AuthTokenPayload';
  authToken?: Maybe<Scalars['AuthToken']>;
  errors: Array<Error>;
};

type BtcWallet = Wallet & {
  __typename?: 'BTCWallet';
  balance: Scalars['SignedAmount'];
  id: Scalars['ID'];
  transactions?: Maybe<TransactionConnection>;
  walletCurrency: WalletCurrency;
};


type BtcWalletTransactionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

type BuildInformation = {
  __typename?: 'BuildInformation';
  buildTime?: Maybe<Scalars['Timestamp']>;
  commitHash?: Maybe<Scalars['String']>;
  helmRevision?: Maybe<Scalars['Int']>;
};

type CaptchaCreateChallengePayload = {
  __typename?: 'CaptchaCreateChallengePayload';
  errors: Array<Error>;
  result?: Maybe<CaptchaCreateChallengeResult>;
};

type CaptchaCreateChallengeResult = {
  __typename?: 'CaptchaCreateChallengeResult';
  challengeCode: Scalars['String'];
  failbackMode: Scalars['Boolean'];
  id: Scalars['String'];
  newCaptcha: Scalars['Boolean'];
};

type CaptchaRequestAuthCodeInput = {
  challengeCode: Scalars['String'];
  phone: Scalars['Phone'];
  secCode: Scalars['String'];
  validationCode: Scalars['String'];
};

type ConsumerAccount = Account & {
  __typename?: 'ConsumerAccount';
  /** return CSV stream, base64 encoded, of the list of transactions in the wallet */
  csvTransactions: Scalars['String'];
  defaultWalletId: Scalars['WalletId'];
  id: Scalars['ID'];
  wallets: Array<Wallet>;
};


type ConsumerAccountCsvTransactionsArgs = {
  walletIds: Array<Scalars['WalletId']>;
};

type Coordinates = {
  __typename?: 'Coordinates';
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

type DeviceNotificationTokenCreateInput = {
  deviceToken: Scalars['String'];
};

type Error = {
  message: Scalars['String'];
  path?: Maybe<Array<Maybe<Scalars['String']>>>;
};

type ExchangeCurrencyUnit =
  | 'BTCSAT'
  | 'USDCENT';

/** Provides global settings for the application which might have an impact for the user. */
type Globals = {
  __typename?: 'Globals';
  buildInformation: BuildInformation;
  /**
   * A list of public keys for the running lightning nodes.
   * This can be used to know if an invoice belongs to one of our nodes.
   */
  nodesIds: Array<Scalars['String']>;
};

type InitiationVia = InitiationViaIntraLedger | InitiationViaLn | InitiationViaOnChain;

type InitiationViaIntraLedger = {
  __typename?: 'InitiationViaIntraLedger';
  counterPartyUsername?: Maybe<Scalars['Username']>;
  counterPartyWalletId?: Maybe<Scalars['WalletId']>;
};

type InitiationViaLn = {
  __typename?: 'InitiationViaLn';
  paymentHash: Scalars['PaymentHash'];
};

type InitiationViaOnChain = {
  __typename?: 'InitiationViaOnChain';
  address: Scalars['OnChainAddress'];
};

type InputError = Error & {
  __typename?: 'InputError';
  code: InputErrorCode;
  message: Scalars['String'];
  path?: Maybe<Array<Maybe<Scalars['String']>>>;
};

type InputErrorCode =
  | 'INVALID_INPUT'
  | 'VALUE_NOT_ALLOWED'
  | 'VALUE_TOO_LONG'
  | 'VALUE_TOO_SHORT';

type IntraLedgerPaymentSendInput = {
  amount: Scalars['SatAmount'];
  memo?: InputMaybe<Scalars['Memo']>;
  recipientWalletId: Scalars['WalletId'];
  walletId: Scalars['WalletId'];
};

type IntraLedgerUpdate = {
  __typename?: 'IntraLedgerUpdate';
  amount: Scalars['SatAmount'];
  txNotificationType: TxNotificationType;
  usdPerSat: Scalars['Float'];
  walletId: Scalars['WalletId'];
};

type InvoicePaymentStatus =
  | 'PAID'
  | 'PENDING';

type LnInvoice = {
  __typename?: 'LnInvoice';
  paymentHash: Scalars['PaymentHash'];
  paymentRequest: Scalars['LnPaymentRequest'];
  paymentSecret: Scalars['LnPaymentSecret'];
  satoshis?: Maybe<Scalars['SatAmount']>;
};

type LnInvoiceCreateInput = {
  amount: Scalars['SatAmount'];
  memo?: InputMaybe<Scalars['Memo']>;
  walletId: Scalars['WalletId'];
};

type LnInvoiceCreateOnBehalfOfRecipientInput = {
  amount: Scalars['SatAmount'];
  descriptionHash?: InputMaybe<Scalars['Hex32Bytes']>;
  memo?: InputMaybe<Scalars['Memo']>;
  recipientWalletId: Scalars['WalletId'];
};

type LnInvoiceFeeProbeInput = {
  paymentRequest: Scalars['LnPaymentRequest'];
  walletId: Scalars['WalletId'];
};

type LnInvoicePayload = {
  __typename?: 'LnInvoicePayload';
  errors: Array<Error>;
  invoice?: Maybe<LnInvoice>;
};

type LnInvoicePaymentInput = {
  memo?: InputMaybe<Scalars['Memo']>;
  paymentRequest: Scalars['LnPaymentRequest'];
  walletId: Scalars['WalletId'];
};

type LnInvoicePaymentStatusInput = {
  paymentRequest: Scalars['LnPaymentRequest'];
};

type LnInvoicePaymentStatusPayload = {
  __typename?: 'LnInvoicePaymentStatusPayload';
  errors: Array<Error>;
  status?: Maybe<InvoicePaymentStatus>;
};

type LnNoAmountInvoice = {
  __typename?: 'LnNoAmountInvoice';
  paymentHash: Scalars['PaymentHash'];
  paymentRequest: Scalars['LnPaymentRequest'];
  paymentSecret: Scalars['LnPaymentSecret'];
};

type LnNoAmountInvoiceCreateInput = {
  memo?: InputMaybe<Scalars['Memo']>;
  walletId: Scalars['WalletId'];
};

type LnNoAmountInvoiceCreateOnBehalfOfRecipientInput = {
  memo?: InputMaybe<Scalars['Memo']>;
  recipientWalletId: Scalars['WalletId'];
};

type LnNoAmountInvoiceFeeProbeInput = {
  amount: Scalars['SatAmount'];
  paymentRequest: Scalars['LnPaymentRequest'];
  walletId: Scalars['WalletId'];
};

type LnNoAmountInvoicePayload = {
  __typename?: 'LnNoAmountInvoicePayload';
  errors: Array<Error>;
  invoice?: Maybe<LnNoAmountInvoice>;
};

type LnNoAmountInvoicePaymentInput = {
  amount: Scalars['SatAmount'];
  memo?: InputMaybe<Scalars['Memo']>;
  paymentRequest: Scalars['LnPaymentRequest'];
  walletId: Scalars['WalletId'];
};

type LnUpdate = {
  __typename?: 'LnUpdate';
  paymentHash: Scalars['PaymentHash'];
  status: InvoicePaymentStatus;
  walletId: Scalars['WalletId'];
};

type MapInfo = {
  __typename?: 'MapInfo';
  coordinates: Coordinates;
  title: Scalars['String'];
};

type MapMarker = {
  __typename?: 'MapMarker';
  mapInfo: MapInfo;
  username?: Maybe<Scalars['Username']>;
};

type MobileVersions = {
  __typename?: 'MobileVersions';
  currentSupported: Scalars['Int'];
  minSupported: Scalars['Int'];
  platform: Scalars['String'];
};

type Mutation = {
  __typename?: 'Mutation';
  accountApiKeyCreate: AccountApiKeyPayload;
  accountApiKeyDisable: SuccessPayload;
  captchaCreateChallenge: CaptchaCreateChallengePayload;
  captchaRequestAuthCode: SuccessPayload;
  deviceNotificationTokenCreate: SuccessPayload;
  intraLedgerPaymentSend: PaymentSendPayload;
  lnInvoiceCreate: LnInvoicePayload;
  lnInvoiceCreateOnBehalfOfRecipient: LnInvoicePayload;
  lnInvoiceFeeProbe: SatAmountPayload;
  lnInvoicePaymentSend: PaymentSendPayload;
  lnNoAmountInvoiceCreate: LnNoAmountInvoicePayload;
  lnNoAmountInvoiceCreateOnBehalfOfRecipient: LnNoAmountInvoicePayload;
  lnNoAmountInvoiceFeeProbe: SatAmountPayload;
  lnNoAmountInvoicePaymentSend: PaymentSendPayload;
  onChainAddressCreate: OnChainAddressPayload;
  onChainAddressCurrent: OnChainAddressPayload;
  onChainPaymentSend: PaymentSendPayload;
  onChainPaymentSendAll: PaymentSendPayload;
  twoFADelete: SuccessPayload;
  twoFAGenerate: TwoFaGeneratePayload;
  twoFASave: SuccessPayload;
  /** @deprecated will be moved to AccountContact */
  userContactUpdateAlias: UserContactUpdateAliasPayload;
  userLogin: AuthTokenPayload;
  userQuizQuestionUpdateCompleted: UserQuizQuestionUpdateCompletedPayload;
  userRequestAuthCode: SuccessPayload;
  userUpdateLanguage: UserUpdateLanguagePayload;
  /** @deprecated Username will be moved to @Handle in Accounts. Also SetUsername should be used instead of UpdateUsername to reflect the idempotency of Handles */
  userUpdateUsername: UserUpdateUsernamePayload;
};


type MutationAccountApiKeyCreateArgs = {
  input: AccountApiKeyCreateInput;
};


type MutationAccountApiKeyDisableArgs = {
  input: AccountApiKeyDisableInput;
};


type MutationCaptchaRequestAuthCodeArgs = {
  input: CaptchaRequestAuthCodeInput;
};


type MutationDeviceNotificationTokenCreateArgs = {
  input: DeviceNotificationTokenCreateInput;
};


type MutationIntraLedgerPaymentSendArgs = {
  input: IntraLedgerPaymentSendInput;
};


type MutationLnInvoiceCreateArgs = {
  input: LnInvoiceCreateInput;
};


type MutationLnInvoiceCreateOnBehalfOfRecipientArgs = {
  input: LnInvoiceCreateOnBehalfOfRecipientInput;
};


type MutationLnInvoiceFeeProbeArgs = {
  input: LnInvoiceFeeProbeInput;
};


type MutationLnInvoicePaymentSendArgs = {
  input: LnInvoicePaymentInput;
};


type MutationLnNoAmountInvoiceCreateArgs = {
  input: LnNoAmountInvoiceCreateInput;
};


type MutationLnNoAmountInvoiceCreateOnBehalfOfRecipientArgs = {
  input: LnNoAmountInvoiceCreateOnBehalfOfRecipientInput;
};


type MutationLnNoAmountInvoiceFeeProbeArgs = {
  input: LnNoAmountInvoiceFeeProbeInput;
};


type MutationLnNoAmountInvoicePaymentSendArgs = {
  input: LnNoAmountInvoicePaymentInput;
};


type MutationOnChainAddressCreateArgs = {
  input: OnChainAddressCreateInput;
};


type MutationOnChainAddressCurrentArgs = {
  input: OnChainAddressCurrentInput;
};


type MutationOnChainPaymentSendArgs = {
  input: OnChainPaymentSendInput;
};


type MutationOnChainPaymentSendAllArgs = {
  input: OnChainPaymentSendAllInput;
};


type MutationTwoFaDeleteArgs = {
  input: TwoFaDeleteInput;
};


type MutationTwoFaSaveArgs = {
  input: TwoFaSaveInput;
};


type MutationUserContactUpdateAliasArgs = {
  input: UserContactUpdateAliasInput;
};


type MutationUserLoginArgs = {
  input: UserLoginInput;
};


type MutationUserQuizQuestionUpdateCompletedArgs = {
  input: UserQuizQuestionUpdateCompletedInput;
};


type MutationUserRequestAuthCodeArgs = {
  input: UserRequestAuthCodeInput;
};


type MutationUserUpdateLanguageArgs = {
  input: UserUpdateLanguageInput;
};


type MutationUserUpdateUsernameArgs = {
  input: UserUpdateUsernameInput;
};

type MyUpdatesPayload = {
  __typename?: 'MyUpdatesPayload';
  errors: Array<Error>;
  me?: Maybe<User>;
  update?: Maybe<UserUpdate>;
};

type OnChainAddressCreateInput = {
  walletId: Scalars['WalletId'];
};

type OnChainAddressCurrentInput = {
  walletId: Scalars['WalletId'];
};

type OnChainAddressPayload = {
  __typename?: 'OnChainAddressPayload';
  address?: Maybe<Scalars['OnChainAddress']>;
  errors: Array<Error>;
};

type OnChainPaymentSendAllInput = {
  address: Scalars['OnChainAddress'];
  memo?: InputMaybe<Scalars['Memo']>;
  targetConfirmations?: InputMaybe<Scalars['TargetConfirmations']>;
  walletId: Scalars['WalletId'];
};

type OnChainPaymentSendInput = {
  address: Scalars['OnChainAddress'];
  amount: Scalars['SatAmount'];
  memo?: InputMaybe<Scalars['Memo']>;
  targetConfirmations?: InputMaybe<Scalars['TargetConfirmations']>;
  walletId: Scalars['WalletId'];
};

type OnChainTxFee = {
  __typename?: 'OnChainTxFee';
  amount: Scalars['SatAmount'];
  targetConfirmations: Scalars['TargetConfirmations'];
};

type OnChainUpdate = {
  __typename?: 'OnChainUpdate';
  amount: Scalars['SatAmount'];
  txHash: Scalars['OnChainTxHash'];
  txNotificationType: TxNotificationType;
  usdPerSat: Scalars['Float'];
  walletId: Scalars['WalletId'];
};

/** Information about pagination in a connection. */
type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

type PaymentError = Error & {
  __typename?: 'PaymentError';
  code: PaymentErrorCode;
  message: Scalars['String'];
  path?: Maybe<Array<Maybe<Scalars['String']>>>;
};

type PaymentErrorCode =
  | 'ACCOUNT_LOCKED'
  | 'INSUFFICIENT_BALANCE'
  | 'INVOICE_PAID'
  | 'LIMIT_EXCEEDED'
  | 'NO_LIQUIDITY'
  | 'NO_ROUTE';

type PaymentSendPayload = {
  __typename?: 'PaymentSendPayload';
  errors: Array<Error>;
  status?: Maybe<PaymentSendResult>;
};

type PaymentSendResult =
  | 'ALREADY_PAID'
  | 'FAILURE'
  | 'PENDING'
  | 'SUCCESS';

/** Price amount expressed in base/offset. To calculate, use: `base / 10^offset` */
type Price = {
  __typename?: 'Price';
  base: Scalars['SafeInt'];
  currencyUnit: ExchangeCurrencyUnit;
  formattedAmount: Scalars['String'];
  offset: Scalars['Int'];
};

/** The range for the X axis in the BTC price graph */
type PriceGraphRange =
  | 'FIVE_YEARS'
  | 'ONE_DAY'
  | 'ONE_MONTH'
  | 'ONE_WEEK'
  | 'ONE_YEAR';

type PriceInput = {
  amount: Scalars['SatAmount'];
  amountCurrencyUnit: ExchangeCurrencyUnit;
  priceCurrencyUnit: ExchangeCurrencyUnit;
};

type PricePayload = {
  __typename?: 'PricePayload';
  errors: Array<Error>;
  price?: Maybe<Price>;
};

type PricePoint = {
  __typename?: 'PricePoint';
  price: Price;
  /** Unix timesamp (number of seconds elapsed since January 1, 1970 00:00:00 UTC) */
  timestamp: Scalars['Timestamp'];
};

type Query = {
  __typename?: 'Query';
  accountApiKeys?: Maybe<Array<Maybe<AccountApiKeyHashed>>>;
  btcPrice?: Maybe<Price>;
  btcPriceList?: Maybe<Array<Maybe<PricePoint>>>;
  businessMapMarkers?: Maybe<Array<Maybe<MapMarker>>>;
  globals?: Maybe<Globals>;
  me?: Maybe<User>;
  mobileVersions?: Maybe<Array<Maybe<MobileVersions>>>;
  onChainTxFee: OnChainTxFee;
  quizQuestions?: Maybe<Array<Maybe<QuizQuestion>>>;
  userDefaultWalletId: Scalars['WalletId'];
  usernameAvailable?: Maybe<Scalars['Boolean']>;
};


type QueryBtcPriceListArgs = {
  range: PriceGraphRange;
};


type QueryOnChainTxFeeArgs = {
  address: Scalars['OnChainAddress'];
  amount: Scalars['SatAmount'];
  targetConfirmations?: InputMaybe<Scalars['TargetConfirmations']>;
  walletId: Scalars['WalletId'];
};


type QueryUserDefaultWalletIdArgs = {
  username: Scalars['Username'];
};


type QueryUsernameAvailableArgs = {
  username: Scalars['Username'];
};

type QuizQuestion = {
  __typename?: 'QuizQuestion';
  /** The earn reward in Satoshis for the quiz question */
  earnAmount: Scalars['SatAmount'];
  id: Scalars['ID'];
};

type SatAmountPayload = {
  __typename?: 'SatAmountPayload';
  amount?: Maybe<Scalars['SatAmount']>;
  errors: Array<Error>;
};

type SettlementVia = SettlementViaIntraLedger | SettlementViaLn | SettlementViaOnChain;

type SettlementViaIntraLedger = {
  __typename?: 'SettlementViaIntraLedger';
  /** Settlement destination: Could be null if the payee does not have a username */
  counterPartyUsername?: Maybe<Scalars['Username']>;
  counterPartyWalletId?: Maybe<Scalars['WalletId']>;
};

type SettlementViaLn = {
  __typename?: 'SettlementViaLn';
  /** @deprecated Shifting property to 'preImage' to improve granularity of the LnPaymentSecret type */
  paymentSecret?: Maybe<Scalars['LnPaymentSecret']>;
  preImage?: Maybe<Scalars['LnPaymentPreImage']>;
};

type SettlementViaOnChain = {
  __typename?: 'SettlementViaOnChain';
  transactionHash: Scalars['OnChainTxHash'];
};

type Subscription = {
  __typename?: 'Subscription';
  lnInvoicePaymentStatus: LnInvoicePaymentStatusPayload;
  myUpdates: MyUpdatesPayload;
  price: PricePayload;
};


type SubscriptionLnInvoicePaymentStatusArgs = {
  input: LnInvoicePaymentStatusInput;
};


type SubscriptionPriceArgs = {
  input: PriceInput;
};

type SuccessPayload = {
  __typename?: 'SuccessPayload';
  errors: Array<Error>;
  success?: Maybe<Scalars['Boolean']>;
};

/**
 * Give details about an individual transaction.
 * Galoy have a smart routing system which is automatically
 * settling intraledger when both the payer and payee use the same wallet
 * therefore it's possible the transactions is being initiated onchain
 * or with lightning but settled intraledger.
 */
type Transaction = {
  __typename?: 'Transaction';
  createdAt: Scalars['Timestamp'];
  direction: TxDirection;
  id: Scalars['ID'];
  /** From which protocol the payment has been initiated. */
  initiationVia: InitiationVia;
  memo?: Maybe<Scalars['Memo']>;
  /** Amount of sats sent or received. */
  settlementAmount: Scalars['SatAmount'];
  settlementFee: Scalars['SatAmount'];
  /** Price in USDCENT/SATS at time of settlement. */
  settlementPrice: Price;
  /** To which protocol the payment has settled on. */
  settlementVia: SettlementVia;
  status: TxStatus;
};

/** A connection to a list of items. */
type TransactionConnection = {
  __typename?: 'TransactionConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<TransactionEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
type TransactionEdge = {
  __typename?: 'TransactionEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Transaction>;
};

type TwoFaDeleteInput = {
  token: Scalars['String'];
};

type TwoFaGeneratePayload = {
  __typename?: 'TwoFAGeneratePayload';
  errors: Array<Error>;
  twoFASecret?: Maybe<TwoFaSecret>;
};

type TwoFaSaveInput = {
  secret: Scalars['String'];
  token: Scalars['String'];
};

type TwoFaSecret = {
  __typename?: 'TwoFASecret';
  secret: Scalars['String'];
  uri: Scalars['String'];
};

type TxDirection =
  | 'RECEIVE'
  | 'SEND';

type TxNotificationType =
  | 'IntraLedgerPayment'
  | 'IntraLedgerReceipt'
  | 'LnInvoicePaid'
  | 'OnchainPayment'
  | 'OnchainReceipt'
  | 'OnchainReceiptPending';

type TxStatus =
  | 'FAILURE'
  | 'PENDING'
  | 'SUCCESS';

type User = {
  __typename?: 'User';
  /**
   * Get single contact details.
   * Can include the transactions associated with the contact.
   */
  contactByUsername: UserContact;
  /**
   * Get full list of contacts.
   * Can include the transactions associated with each contact.
   * @deprecated will be moved to account
   */
  contacts: Array<UserContact>;
  createdAt: Scalars['Timestamp'];
  defaultAccount: Account;
  id: Scalars['ID'];
  /**
   * Preferred language for user.
   * When value is 'default' the intent is to use preferred language from OS settings.
   */
  language: Scalars['Language'];
  /** Phone number with international calling code. */
  phone: Scalars['Phone'];
  /** List the quiz questions the user may have completed. */
  quizQuestions: Array<UserQuizQuestion>;
  twoFAEnabled?: Maybe<Scalars['Boolean']>;
  /**
   * Optional immutable user friendly identifier.
   * @deprecated will be moved to @Handle in Account and Wallet
   */
  username?: Maybe<Scalars['Username']>;
};


type UserContactByUsernameArgs = {
  username: Scalars['Username'];
};

type UserContact = {
  __typename?: 'UserContact';
  /**
   * Alias the user can set for this contact.
   * Only the user can see the alias attached to their contact.
   */
  alias?: Maybe<Scalars['ContactAlias']>;
  id: Scalars['Username'];
  /** Paginated list of transactions sent to/from this contact. */
  transactions?: Maybe<TransactionConnection>;
  transactionsCount: Scalars['Int'];
  /** Actual identifier of the contact. */
  username: Scalars['Username'];
};


type UserContactTransactionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

type UserContactUpdateAliasInput = {
  alias: Scalars['ContactAlias'];
  username: Scalars['Username'];
};

type UserContactUpdateAliasPayload = {
  __typename?: 'UserContactUpdateAliasPayload';
  contact?: Maybe<UserContact>;
  errors: Array<Error>;
};

type UserLoginInput = {
  code: Scalars['OneTimeAuthCode'];
  phone: Scalars['Phone'];
};

type UserQuizQuestion = {
  __typename?: 'UserQuizQuestion';
  completed: Scalars['Boolean'];
  question: QuizQuestion;
};

type UserQuizQuestionUpdateCompletedInput = {
  id: Scalars['ID'];
};

type UserQuizQuestionUpdateCompletedPayload = {
  __typename?: 'UserQuizQuestionUpdateCompletedPayload';
  errors: Array<Error>;
  userQuizQuestion?: Maybe<UserQuizQuestion>;
};

type UserRequestAuthCodeInput = {
  phone: Scalars['Phone'];
};

type UserUpdate = IntraLedgerUpdate | LnUpdate | OnChainUpdate | Price;

type UserUpdateLanguageInput = {
  language: Scalars['Language'];
};

type UserUpdateLanguagePayload = {
  __typename?: 'UserUpdateLanguagePayload';
  errors: Array<Error>;
  user?: Maybe<User>;
};

type UserUpdateUsernameInput = {
  username: Scalars['Username'];
};

type UserUpdateUsernamePayload = {
  __typename?: 'UserUpdateUsernamePayload';
  errors: Array<Error>;
  user?: Maybe<User>;
};

type Wallet = {
  balance: Scalars['SignedAmount'];
  id: Scalars['ID'];
  /**
   * Transactions are ordered anti-chronogically,
   * ie: the newest transaction will be first
   */
  transactions?: Maybe<TransactionConnection>;
  walletCurrency: WalletCurrency;
};


type WalletTransactionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

type WalletCurrency =
  | 'BTC';

type CaptchaCreateChallengeMutationVariables = Exact<{ [key: string]: never; }>;


type CaptchaCreateChallengeMutation = { __typename?: 'Mutation', captchaCreateChallenge: { __typename?: 'CaptchaCreateChallengePayload', errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }>, result?: { __typename?: 'CaptchaCreateChallengeResult', id: string, challengeCode: string, newCaptcha: boolean, failbackMode: boolean } | null | undefined } };

type CaptchaRequestAuthCodeMutationVariables = Exact<{
  input: CaptchaRequestAuthCodeInput;
}>;


type CaptchaRequestAuthCodeMutation = { __typename?: 'Mutation', captchaRequestAuthCode: { __typename?: 'SuccessPayload', success?: boolean | null | undefined, errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }> } };

type IntraLedgerPaymentSendMutationVariables = Exact<{
  input: IntraLedgerPaymentSendInput;
}>;


type IntraLedgerPaymentSendMutation = { __typename?: 'Mutation', intraLedgerPaymentSend: { __typename?: 'PaymentSendPayload', status?: PaymentSendResult | null | undefined, errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }> } };

type LnInvoiceCreateMutationVariables = Exact<{
  input: LnInvoiceCreateInput;
}>;


type LnInvoiceCreateMutation = { __typename?: 'Mutation', lnInvoiceCreate: { __typename?: 'LnInvoicePayload', errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }>, invoice?: { __typename?: 'LnInvoice', paymentRequest: string, paymentHash: string } | null | undefined } };

type LnInvoiceFeeProbeMutationVariables = Exact<{
  input: LnInvoiceFeeProbeInput;
}>;


type LnInvoiceFeeProbeMutation = { __typename?: 'Mutation', lnInvoiceFeeProbe: { __typename?: 'SatAmountPayload', amount?: number | null | undefined, errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }> } };

type LnInvoicePaymentSendMutationVariables = Exact<{
  input: LnInvoicePaymentInput;
}>;


type LnInvoicePaymentSendMutation = { __typename?: 'Mutation', lnInvoicePaymentSend: { __typename?: 'PaymentSendPayload', status?: PaymentSendResult | null | undefined, errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }> } };

type LnNoAmountInvoiceCreateMutationVariables = Exact<{
  input: LnNoAmountInvoiceCreateInput;
}>;


type LnNoAmountInvoiceCreateMutation = { __typename?: 'Mutation', lnNoAmountInvoiceCreate: { __typename?: 'LnNoAmountInvoicePayload', errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }>, invoice?: { __typename?: 'LnNoAmountInvoice', paymentRequest: string, paymentHash: string } | null | undefined } };

type LnNoAmountInvoiceFeeProbeMutationVariables = Exact<{
  input: LnNoAmountInvoiceFeeProbeInput;
}>;


type LnNoAmountInvoiceFeeProbeMutation = { __typename?: 'Mutation', lnNoAmountInvoiceFeeProbe: { __typename?: 'SatAmountPayload', amount?: number | null | undefined, errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }> } };

type LnNoAmountInvoicePaymentSendMutationVariables = Exact<{
  input: LnNoAmountInvoicePaymentInput;
}>;


type LnNoAmountInvoicePaymentSendMutation = { __typename?: 'Mutation', lnNoAmountInvoicePaymentSend: { __typename?: 'PaymentSendPayload', status?: PaymentSendResult | null | undefined, errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }> } };

type OnChainPaymentSendMutationVariables = Exact<{
  input: OnChainPaymentSendInput;
}>;


type OnChainPaymentSendMutation = { __typename?: 'Mutation', onChainPaymentSend: { __typename?: 'PaymentSendPayload', status?: PaymentSendResult | null | undefined, errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }> } };

type UserLoginMutationVariables = Exact<{
  input: UserLoginInput;
}>;


type UserLoginMutation = { __typename?: 'Mutation', userLogin: { __typename?: 'AuthTokenPayload', authToken?: string | null | undefined, errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }> } };

type MeQueryVariables = Exact<{
  hasToken: Scalars['Boolean'];
}>;


type MeQuery = { __typename?: 'Query', globals?: { __typename?: 'Globals', nodesIds: Array<string> } | null | undefined, btcPrice?: { __typename?: 'Price', base: number, offset: number, currencyUnit: ExchangeCurrencyUnit, formattedAmount: string } | null | undefined, me?: { __typename?: 'User', id: string, username?: string | null | undefined, language: string, defaultAccount: { __typename?: 'ConsumerAccount', id: string, wallets: Array<{ __typename?: 'BTCWallet', id: string, balance: number }> } } | null | undefined };

type OnChainAddressCurrentMutationVariables = Exact<{
  input: OnChainAddressCurrentInput;
}>;


type OnChainAddressCurrentMutation = { __typename?: 'Mutation', onChainAddressCurrent: { __typename?: 'OnChainAddressPayload', address?: string | null | undefined, errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }> } };

type OnChainTxFeeQueryVariables = Exact<{
  walletId: Scalars['WalletId'];
  address: Scalars['OnChainAddress'];
  amount: Scalars['SatAmount'];
  targetConfirmations?: InputMaybe<Scalars['TargetConfirmations']>;
}>;


type OnChainTxFeeQuery = { __typename?: 'Query', onChainTxFee: { __typename?: 'OnChainTxFee', amount: number, targetConfirmations: number } };

type UserDefaultWalletIdQueryVariables = Exact<{
  username: Scalars['Username'];
}>;


type UserDefaultWalletIdQuery = { __typename?: 'Query', userDefaultWalletId: string };

type MyUpdatesSubscriptionVariables = Exact<{ [key: string]: never; }>;


type MyUpdatesSubscription = { __typename?: 'Subscription', myUpdates: { __typename?: 'MyUpdatesPayload', errors: Array<{ __typename?: 'InputError', message: string } | { __typename?: 'PaymentError', message: string }>, me?: { __typename?: 'User', id: string, defaultAccount: { __typename?: 'ConsumerAccount', id: string, wallets: Array<{ __typename?: 'BTCWallet', id: string, walletCurrency: WalletCurrency, balance: number }> } } | null | undefined, update?: { __typename?: 'IntraLedgerUpdate', txNotificationType: TxNotificationType, amount: number, usdPerSat: number, type: 'IntraLedgerUpdate' } | { __typename?: 'LnUpdate', paymentHash: string, status: InvoicePaymentStatus, type: 'LnUpdate' } | { __typename?: 'OnChainUpdate', txNotificationType: TxNotificationType, txHash: string, amount: number, usdPerSat: number, type: 'OnChainUpdate' } | { __typename?: 'Price', base: number, offset: number, currencyUnit: ExchangeCurrencyUnit, formattedAmount: string, type: 'Price' } | null | undefined } };

}