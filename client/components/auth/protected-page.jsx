import React from 'react'
import { useAuth } from '~/components/auth/auth-context'

const ProtectedPage = ({ children }) => {
  const { userJwt, userName } = useAuth()

  if (!userName || !userJwt) return null

  return <>{children}</>
}

export default ProtectedPage
