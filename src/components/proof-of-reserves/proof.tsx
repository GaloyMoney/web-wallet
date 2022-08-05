import { SuccessCheckmark } from "@galoymoney/react"
import { isLiabilityIncludedInTree } from "proof-of-liabilities"

type LiablityProof = {
  accountId: string
  totalBalance: number
  nonce: number
  partialLiabilityProofs: {
    idx: number
    balance: number
    merklePath: {
      node: {
        sum: number
        hash: string
      }
      index: number
    }[]
  }
}

type LiabilityProofFCT = React.FC<{
  liabilityProof: LiablityProof
  rootHash: string
}>

const ValidateProof: LiabilityProofFCT = ({ liabilityProof, rootHash }) => {
  const validatedProof = isLiabilityIncludedInTree(liabilityProof, rootHash)
  if (validatedProof.isProofValid) {
    return (
      <div>
        <h3>Claimed Balance: {liabilityProof.totalBalance} </h3>
        <h3>Proven Balance: {validatedProof.provenBalance}</h3>
        <h1>Your liability was successfully included in the liability tree! </h1>
        <SuccessCheckmark />
      </div>
    )
  }
  return (
    <div className="center-display">
      <h1> The Liabilty Proof is not valid </h1>
    </div>
  )
}
export default ValidateProof
