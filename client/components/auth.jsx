import React, { createContext, useContext, useState, useEffect } from 'react'
import AuthDialog from './auth-dialog'
import milou from '../lib/milou'
import RequestError from './request-error'

const USER_CACHE_KEY = 'fdn_user'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const [error, setError] = React.useState(null)
  const [userName, setUserName] = useState()
  const [userJwt, setUserJwt] = useState()
  const [userId, setUserId] = useState()

  const storeUser = () => {
    const user = {
      id: userId,
      jwt: userJwt,
      name: userName
    }
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user))
  }

  const loadStoredUser = () => {
    const rawUser = localStorage.getItem(USER_CACHE_KEY)
    const user = JSON.parse(rawUser)
    if (user && Object.keys(user).length > 0) {
      setUserName(user.name)
      setUserId(user.id)
      setUserJwt(user.jwt)
      return user
    }
    return null
  }

  const parseJwt = token => {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload)
  }

  const createServerUser = async () => {
    try {
      const { jwt } = await milou({
        method: 'POST',
        url: `${process.env.API_URL}/rpc/generate_user`
      })
      const { user_id: userId } = parseJwt(jwt)
      setUserId(userId)
      setUserJwt(jwt)
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    const storedUser = loadStoredUser()
    if (!storedUser) {
      createServerUser()
    }
  }, [setUserJwt])

  if (error) {
    return <RequestError />
  }

  if (!userJwt || !userName) {
    return <AuthDialog setUserName={setUserName} />
  }

  storeUser()
  return (
    <AuthContext.Provider value={{ userId, userName, userJwt }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
