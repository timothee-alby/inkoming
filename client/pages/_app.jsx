import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import AuthProvider from '~/components/auth'
import ProtectectPage from '~/components/protected-page'
import WelcomeDialog from '~/components/welcome-dialog'
import theme from '~/lib/theme'

const AppWrapper = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <WelcomeDialog />
        <ProtectectPage>
          <Component {...pageProps} />
        </ProtectectPage>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default AppWrapper
