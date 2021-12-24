import i18n from "translate"

const Balance = ({ balance }: { balance: number }) => {
  return (
    <div className="balance">
      <div className="title">{i18n.t("CurrentBalance")}</div>
      <div className="value">
        <div className="primary">$0</div>
        <div className="secondary">({balance} sats)</div>
      </div>
    </div>
  )
}

export default Balance
