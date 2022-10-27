import { translate, useAuthContext, NoPropsFCT } from "store/index"

import Header from "components/header"
import ContactsList from "components/contacts/list"

const Contacts: NoPropsFCT = () => {
  const { isAuthenticated } = useAuthContext()

  return (
    <div className="contacts">
      <Header page="contacts" />

      <div className="page-title">{translate("Contacts")}</div>
      {isAuthenticated ? (
        <ContactsList />
      ) : (
        <div className="no-data">{translate("No Contacts")}</div>
      )}
    </div>
  )
}

export default Contacts
