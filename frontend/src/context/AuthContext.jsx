import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  const login = (userOrUsername) => {
    if (typeof userOrUsername === 'string') {
      setCurrentUser({
        username:  userOrUsername,
        initial:   userOrUsername[0].toUpperCase(),
        email:     '',
        status:    'Available',
        avatarUrl: null,
      })
    } else {
      setCurrentUser(userOrUsername)
    }
  }

  const logout = () => setCurrentUser(null)

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
