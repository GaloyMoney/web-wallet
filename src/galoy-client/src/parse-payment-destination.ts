import * as bolt11 from "bolt11"
import url from "url"
import { networks, address } from "bitcoinjs-lib"

import { getDescription, getDestination } from "./bolt11"

export type Network = "bitcoin" | "testnet" | "regtest"
export type PaymentType = "lightning" | "onchain" | "username" | "lnurl"
export interface ValidPaymentReponse {
  valid: boolean
  errorMessage?: string | undefined
  invoice?: string | undefined // for lightning
  address?: string | undefined // for bitcoin
  lnurl?: string | undefined // for lnurl
  amount?: number | undefined
  amountless?: boolean | undefined
  memo?: string | undefined
  paymentType?: PaymentType
  sameNode?: boolean | undefined
  username?: string | undefined
}

export const lightningInvoiceHasExpired = (
  payReq: bolt11.PaymentRequestObject,
): boolean => {
  return Boolean(payReq?.timeExpireDate && payReq.timeExpireDate < Date.now() / 1000)
}

// from https://github.com/bitcoin/bips/blob/master/bip-0020.mediawiki#Transfer%20amount/size
const reAmount = /^(([\d.]+)(X(\d+))?|x([\da-f]*)(\.([\da-f]*))?(X([\da-f]+))?)$/iu
const parseAmount = (txt: string): number => {
  const match = txt.match(reAmount)
  if (!match) {
    return NaN
  }
  return Math.round(
    match[5]
      ? (parseInt(match[5], 16) +
          (match[7] ? parseInt(match[7], 16) * Math.pow(16, -match[7].length) : 0)) *
          (match[9] ? Math.pow(16, parseInt(match[9], 16)) : 0x10000)
      : Number(match[2]) * (match[4] ? Math.pow(10, Number(match[4])) : 1e8),
  )
}

type ParsePaymentDestinationArgs = {
  destination: string
  network: Network
  pubKey: string
}

export const parsePaymentDestination = ({
  destination,
  network,
  pubKey,
}: ParsePaymentDestinationArgs): ValidPaymentReponse => {
  if (!destination) {
    return { valid: false }
  }

  // input might start with 'lightning:', 'bitcoin:'
  let [protocol, data] = destination.split(":")
  let paymentType: PaymentType | undefined = undefined
  let lnurl: string | undefined = undefined

  if (protocol.toLowerCase() === "bitcoin") {
    paymentType = "onchain"
  } else if (protocol.toLowerCase() === "lightning") {
    paymentType = "lightning"
    // some apps encode lightning invoices in UPPERCASE
    data = data.toLowerCase()
  } else if (
    (protocol && protocol.toLowerCase().startsWith("lnurl")) ||
    (data && data.toLowerCase().startsWith("lnurl"))
  ) {
    paymentType = "lnurl"
    lnurl = protocol || data

    // no protocol. let's see if this could have an address directly
  } else if (protocol.toLowerCase().startsWith("ln")) {
    // possibly a lightning address?
    paymentType = "lightning"

    if (network === "testnet" && protocol.toLowerCase().startsWith("lnbc")) {
      return {
        valid: false,
        paymentType,
        errorMessage: "This is a mainnet invoice. The wallet is on testnet",
      }
    }

    if (network === "bitcoin" && protocol.toLowerCase().startsWith("lntb")) {
      return {
        valid: false,
        paymentType,
        errorMessage: "This is a testnet invoice. The wallet is on mainnet",
      }
    }

    // some apps encode lightning invoices in UPPERCASE
    data = protocol.toLowerCase()
  } else if (protocol.toLowerCase() === "https") {
    const domain = "//ln.bitcoinbeach.com/"
    if (data.startsWith(domain)) {
      return {
        valid: true,
        paymentType: "username",
        username: data.substring(domain.length),
      }
    }
  } else {
    // no schema
    data = protocol
  }

  if (paymentType === "onchain" || paymentType === undefined) {
    try {
      const decodedData = url.parse(data, true)
      let path = decodedData.pathname // using url node library. the address is exposed as the "host" here
      if (!path) {
        throw new Error("Missing pathname in decoded data")
      }
      // some apps encode bech32 addresses in UPPERCASE
      const lowerCasePath = path.toLowerCase()
      if (
        lowerCasePath.startsWith("bc1") ||
        lowerCasePath.startsWith("tb1") ||
        lowerCasePath.startsWith("bcrt1")
      ) {
        path = lowerCasePath
      }

      let amount: number | undefined = undefined

      try {
        if (!decodedData?.query?.amount || Array.isArray(decodedData?.query?.amount)) {
          throw new Error("Invaild amount in decoded data")
        }
        amount = parseAmount(decodedData.query.amount)
      } catch (err) {
        console.error(`can't decode amount ${err}`)
      }

      // will throw if address is not valid
      address.toOutputScript(path, networks[network])
      paymentType = "onchain"
      return {
        valid: true,
        paymentType,
        address: path,
        amount,
        amountless: !amount,
      }
    } catch (err) {
      console.error(`issue with payment ${err}`)
      return { valid: false }
    }
  } else if (paymentType === "lightning") {
    let payReq: bolt11.PaymentRequestObject | undefined = undefined
    try {
      payReq = bolt11.decode(data)
    } catch (err) {
      console.error(err)
      return { valid: false }
    }
    const sameNode = pubKey === getDestination(payReq)

    const amount =
      payReq.satoshis || payReq.millisatoshis
        ? payReq.satoshis ?? Number(payReq.millisatoshis) / 1000
        : NaN

    if (lightningInvoiceHasExpired(payReq)) {
      return { valid: false, errorMessage: "invoice has expired", paymentType }
    }

    const memo = getDescription(payReq)
    return {
      valid: true,
      invoice: data,
      amount,
      memo,
      paymentType,
      sameNode,
    }
  }

  if (paymentType === "lnurl") {
    return {
      valid: true,
      lnurl,
      amountless: false,
    }
  }

  return {
    valid: false,
    errorMessage: "We are unable to detect an invoice or payment address",
  }
}
