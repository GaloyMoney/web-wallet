import { useEffect } from "react"

import { SuccessCheckmark } from "@galoymoney/react"

import { translate, history, translateUnknown } from "store/index"
import useMainQuery from "hooks/use-main-query"

import Link from "components/link"

const CALLBACK_DELAY = 3_000

type RFC = React.FC<{
  success: boolean
  errorsMessage?: string
}>

const ConversionStatus: RFC = ({ success, errorsMessage }) => {
  const { refetch } = useMainQuery()

  useEffect(() => {
    refetch()
    const navigateToHomeTimeout = setTimeout(() => {
      history.push("/")
    }, CALLBACK_DELAY)
    return () => clearTimeout(navigateToHomeTimeout)
  }, [refetch])

  return (
    <div className="conversion-status">
      {success && !errorsMessage ? (
        <>
          <SuccessCheckmark />

          <div className="success">{translate("Conversion successful")}</div>
        </>
      ) : (
        <div className="error">
          {translateUnknown(errorsMessage ?? "Something went wrong")}
        </div>
      )}

      <div className="nav-back">
        <Link to="/">{translate("Home")}</Link>
      </div>
    </div>
  )
}

export default ConversionStatus
