import { translate } from "translate"
import Header from "./header"

const Receive = () => {
  return (
    <div className="receive">
      <Header />
      <div className="page-title">{translate("Receive Bitcoin")}</div>
    </div>
  )
}

export default Receive
