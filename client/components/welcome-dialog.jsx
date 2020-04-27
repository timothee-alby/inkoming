import React from 'react'
import { useAuth } from './auth'
import AuthDialog from './auth-dialog'

const WelcomeDialog = ({ room }) => {
  const { userName, setUserName } = useAuth()

  if (userName) {
    return null
  }

  return <AuthDialog setUserName={setUserName} />
}

export default WelcomeDialog
