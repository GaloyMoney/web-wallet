import { translate } from "translate"
import Header from "./header"

const Send = () => {
  return (
    <div className="send">
      <Header />
      <div className="page-title">{translate("Send Bitcoin")}</div>
    </div>
  )
}

export default Send
