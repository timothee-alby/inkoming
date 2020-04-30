import React from 'react'
import { useAuth } from '~/components/auth'
import AuthDialog from '~/components/auth-dialog'

const WelcomeDialog = ({ room }) => {
  const { userJwt, userName, setUserName } = useAuth()

  if (userJwt && userName) {
    return null
  }

  return <AuthDialog />
}

export default WelcomeDialog
