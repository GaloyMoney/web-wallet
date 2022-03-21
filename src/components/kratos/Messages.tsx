import { UiText } from "@ory/kratos-client"

interface MessageProps {
  message: UiText
}

const messageText = (message: UiText): string => {
  switch (message.id) {
    case 4000005:
      return "Password is too short"
    case 4000006:
      return "Invaild email or password"
    case 4000007:
      return "An account with the same email exists already"

    default:
      return message.text
  }
}

export const Message = ({ message }: MessageProps) => {
  return <div className={`${message.type}-message`}>{messageText(message)}</div>
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
    <div className="form-messages">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  )
}
