import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'neochat_token'
const USER_KEY  = 'neochat_user'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null)

  const login = (userOrUsername, jwtToken) => {
    let userObj
    if (typeof userOrUsername === 'string') {
      userObj = {
        username:  userOrUsername,
        initial:   userOrUsername[0].toUpperCase(),
        email:     '',
        status:    'Available',
        avatarUrl: null,
      }
    } else {
      userObj = {
        ...userOrUsername,
        initial: (userOrUsername.userName || userOrUsername.username || '?')[0].toUpperCase(),
        username: userOrUsername.userName || userOrUsername.username,
      }
    }
    setCurrentUser(userObj)
    localStorage.setItem(USER_KEY, JSON.stringify(userObj))
    if (jwtToken) {
      setToken(jwtToken)
      localStorage.setItem(TOKEN_KEY, jwtToken)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setToken(null)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  const updateUser = (updates) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ currentUser, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
