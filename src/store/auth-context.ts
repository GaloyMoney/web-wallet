import { useContext, createContext } from "react"

export type AuthIdentity = {
  id: string
  uid: string
  uidc: string
  phoneNumber?: string
  emailAddress?: string
  firstName?: string
  lastName?: string
  accountStatus?: "NEW" | "PENDING" | "ACTIVE" | "LOCKED" // FIXME: Get from client
}

export type AuthSession = {
  identity: AuthIdentity
} | null

type AuthContextType = {
  isAuthenticated: boolean
  authIdentity?: AuthIdentity
  setAuthSession: (session: AuthSession) => void
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthSession: () => {},
})

export const useAuthContext: () => AuthContextType = () => {
  return useContext<AuthContextType>(AuthContext)
}
