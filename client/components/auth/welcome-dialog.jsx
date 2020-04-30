import React from 'react'
import { useAuth } from '~/components/auth/auth-context'
import AuthDialog from '~/components/auth/auth-dialog'

const WelcomeDialog = ({ room }) => {
  const { userJwt, userName, setUserName } = useAuth()

  if (userJwt && userName) {
    return null
  }

  return <AuthDialog />
}

export default WelcomeDialog
