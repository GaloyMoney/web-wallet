export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
})

export const satsFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
})

export const satsToBTC = (satsAmount: number): number => satsAmount / 10 ** 8
