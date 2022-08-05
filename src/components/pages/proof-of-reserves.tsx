import { useState, useEffect } from "react"
import axios from "axios"
import ValidateProof from "components/proof-of-reserves/proof"
import Header from "components/header"
import { NoPropsFCT, useAuthContext } from "store"
import useMainQuery from "hooks/use-main-query"

const ListInputField: NoPropsFCT = () => {
  const [rootHash, setRootHash] = useState("")
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const { btcWalletId } = useMainQuery()

  const fetchTreeMetadata = async () => {
    const query = `query TreeMetadata{
      treeMetadata{
        roothash
      }
    }`
    const response = await axios({
      url: "http://localhost:4004/",
      method: "post",
      data: {
        query,
      },
    })
    setRootHash(response.data.data.treeMetadata.roothash)
  }
  useEffect(() => {
    fetchTreeMetadata()
  })

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault()
    try {
      const query = `query Proof{
        liabilityProof(accountId:"${btcWalletId}", roothash:"${rootHash}"){
          accountId
          totalBalance
          nonce
          partialLiabilityProofs{
            idx
            balance
            merklePath{
              node{
                sum
                hash
              }
              index
            }
          }
        }
      }`
      const response = await axios({
        url: "http://localhost:4004/",
        method: "post",
        data: {
          query,
        },
      })

      setData(response.data.data.liabilityProof)
    } catch (err) {
      setError(err)
    }
  }
  return (
    <div>
      {!data && !error && (
        <div className="destination-input ">
          <div className="input-label">Wallet Id</div>
          <div className="destination">
            <input type="text" placeholder="Wallet Id" value={btcWalletId} readOnly />
          </div>
          <div className="input-label">Root Hash</div>
          <div className="destination">
            <input readOnly type="text" value={rootHash} placeholder="Root Hash" />
          </div>
          <div className="action-button center-display">
            <button onClick={handleSubmit}>Verify Liabilities</button>
          </div>
        </div>
      )}
      {data && <ValidateProof liabilityProof={data} rootHash={rootHash} />}
    </div>
  )
}

const ProofOfReserves = () => {
  const { isAuthenticated } = useAuthContext()
  return (
    <div className="proof-of-reserves">
      <Header page="proof-of-reserves" />
      <div className="page-title">Proof of Reserves</div>
      {isAuthenticated ? (
        <ListInputField />
      ) : (
        <div className="no-data">Please login to see this page</div>
      )}
    </div>
  )
}
export default ProofOfReserves
