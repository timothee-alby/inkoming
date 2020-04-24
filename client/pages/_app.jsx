import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import AuthProvider from '../components/auth'
import theme from '../lib/theme'
import '../public/styles/dist/pattern.min.css'
import '../public/styles/dist/roboto.css'

const AppWrapper = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default AppWrapper
