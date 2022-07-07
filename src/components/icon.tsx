import React from "react"

export type IconName =
  | "add"
  | "at"
  | "bitcoin"
  | "clock"
  | "close"
  | "copy"
  | "eye"
  | "home"
  | "key"
  | "list"
  | "lock"
  | "login"
  | "logout"
  | "menu"
  | "opacity"
  | "people"
  | "person"
  | "qrcode"
  | "receive"
  | "sat"
  | "send"
  | "settings"
  | "spinner"
  | "submit"
  | "world"

export const Icon: React.FC<{ name: IconName }> = ({ name }) => {
  return <i className={"icon-" + name} />
}
