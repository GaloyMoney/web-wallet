import { SuccessCheckmark } from "@galoymoney/react"
import { isLiabilityIncludedInTree } from "proof-of-liabilities"

const Temp = (props: any) => {
  const liabilityProof = props.liabilityProof
  const rootHash = props.rootHash
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
export default Temp
