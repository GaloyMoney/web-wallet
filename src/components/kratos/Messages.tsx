import { UiText } from "@ory/kratos-client"

interface MessageProps {
  message: UiText
}

export const Message = ({ message }: MessageProps) => {
  return <div className={`alert-${message.type}`}>{message.text}</div>
}

interface MessagesProps {
  messages?: Array<UiText>
}

export const Messages = ({ messages }: MessagesProps) => {
  if (!messages) {
    // No messages? Do nothing.
    return null
  }

  return (
    <div>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  )
}
