import { useState, useEffect } from "react"
import axios from "axios"
import Temp from "components/proof-of-reserves/temp"
import Header from "components/header"
import { useAuthContext } from "store"
import useMainQuery from "hooks/use-main-query"

const ListInputField = () => {
  const [rootHash, setRootHash] = useState("")
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  // const [walletId, setWalletId] = useState("")
  const { btcWalletId } = useMainQuery()

  const fetchTreeMetadata = async () => {
    const query = `query{
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

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    try {
      const query = `query{
            liabilityProof(accountId:"${btcWalletId}", merkleRoot:"${rootHash}"){
              partialLiabilityProofs{
                merklePath{
                  node{
                    sum
                    hash
                  }
                  index
                }
                balance
                idx
              }
              nonce
              accountId
              totalBalance
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
      {data && <Temp liabilityProof={data} rootHash={rootHash} />}
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
