export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
})

export const satsToBTC = (satsAmount: number): number => satsAmount / 10 ** 8
