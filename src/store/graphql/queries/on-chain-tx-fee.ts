import { gql } from "@apollo/client"

const onChainTxFee = gql`
  query onChainTxFee(
    $walletId: WalletId!
    $address: OnChainAddress!
    $amount: SatAmount!
    $targetConfirmations: TargetConfirmations
  ) {
    onChainTxFee(
      walletId: $walletId
      address: $address
      amount: $amount
      targetConfirmations: $targetConfirmations
    ) {
      amount
      targetConfirmations
    }
  }
`
export default onChainTxFee
