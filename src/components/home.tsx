import { gql, useQuery } from "urql"
import Header from "./header"

const QUERY_ME = gql`
  query me {
    me {
      id
      username
      defaultAccount {
        id
        wallets {
          id
          balance
        }
      }
    }
  }
`
const Home = () => {
  const [result] = useQuery({
    query: QUERY_ME,
  })

  const balance = result?.data?.me?.defaultAccount?.wallets?.[0]?.balance ?? 0

  return (
    <div className="home">
      <Header balance={balance} />
    </div>
  )
}

export default Home
