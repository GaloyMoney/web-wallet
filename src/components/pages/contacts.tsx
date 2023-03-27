import { gql } from "@apollo/client"
import { Spinner } from "@galoymoney/react"
import { truncatedDisplay } from "@galoymoney/client"
import { useContactsQuery } from "graphql/generated"
import { translate, history, useAuthContext, NoPropsFCT } from "store/index"

import ErrorMessage from "components/error-message"
import Header from "components/header"
import Icon from "components/icon"

gql`
  query contacts {
    me {
      id
      contacts {
        username
        alias
        transactionsCount
        __typename
      }
      __typename
    }
  }
`

const ContactsList: NoPropsFCT = () => {
  const { data, loading, error } = useContactsQuery({
    context: {
      credentials: "include",
    },
  })

  const handleSendBitcoin = (contactUsername: string) => {
    history.push(`/send?to=${contactUsername}`)
  }

  const showContactDetails = (contactUsername: string) => {
    history.push(`/transactions?username=${contactUsername}`)
  }

  return (
    <div className="list">
      {loading && <Spinner size="big" />}

      {error && <ErrorMessage message={error.message} />}

      {data?.me?.contacts.length === 0 && (
        <div className="no-data">{translate("No Contacts")}</div>
      )}

      {data?.me?.contacts.map((contact) => {
        return (
          <div key={contact.username} className="contact">
            <Icon name="person" />
            <div className="name" onClick={() => handleSendBitcoin(contact.username)}>
              {truncatedDisplay(contact.alias ?? contact.username)}
            </div>
            <div className="actions">
              <div
                title={translate("Transaction List")}
                onClick={() => showContactDetails(contact.username)}
              >
                <Icon name="list" />
              </div>
              <div
                title={translate("Send Bitcoin")}
                onClick={() => handleSendBitcoin(contact.username)}
              >
                <Icon name="send" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

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
