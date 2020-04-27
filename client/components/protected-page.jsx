import React from 'react'
import { useAuth } from './auth'

const ProtectedPage = ({ children }) => {
  const { userJwt, userName } = useAuth()

  if (!userName || !userJwt) return null

  return <>{children}</>
}

export default ProtectedPage
