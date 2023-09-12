import { translate, useAuthContext, NoPropsFCT } from "store/index"

import Header from "components/header"
import TransactionList from "components/transactions/list"
import { gql } from "@apollo/client"
import { useBtcPriceListQuery } from "graphql/generated"

gql`
  query btcPriceList($range: PriceGraphRange!) {
    btcPriceList(range: $range) {
      timestamp
      price {
        base
        offset
        currencyUnit
      }
    }
  }
`

const Home: NoPropsFCT = () => {
  const { isAuthenticated } = useAuthContext()

  const { error, data } = useBtcPriceListQuery({
    fetchPolicy: "no-cache",
    variables: { range: "ONE_DAY" },
  })

  return (
    <>
      <div className="home">
        <Header page="home" />

        <p>{JSON.stringify(data?.btcPriceList)}</p>
        <p>{error && error.message}</p>

        <div className="recent-transactions">
          {isAuthenticated && (
            <>
              <div className="header">{translate("Recent Transactions")}</div>
              <TransactionList />
            </>
          )}
        </div>
      </div>

      <div id="powered-by">
        <div className="content">
          {translate("Powered By")}{" "}
          <a href="https://galoy.io/" target="_blank" rel="noreferrer">
            Galoy
          </a>
        </div>
      </div>
    </>
  )
}

export default Home
