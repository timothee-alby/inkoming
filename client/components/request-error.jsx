import OError from '@overleaf/o-error'
import React from 'react'
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText
  },
  content: {
    color: theme.palette.error.contrastText
  }
}))

const RequestError = ({ error, setError }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [isOpen, setIsOpen] = React.useState(true)
  const router = useRouter()

  const errorInfo = OError.getFullInfo(error)

  // order is important: first try to display a client-specific error, then the
  // server error if available and fall back to the client context key
  // If none of the keys are defined in the locales, the generic error message
  // will be displayed.
  const errorKey =
    errorInfo.clientKey ||
    errorInfo.serverKey ||
    errorInfo.clientContextKey ||
    ''

  const handleClose = () => {
    if (!setError) return
    setIsOpen(false)
    setError(null)
  }

  const handleReload = () => {
    router.reload()
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box className={classes.container}>
        <DialogTitle id="alert-dialog-title">
          {t([`error.${errorKey}.title`, 'error.oops.title'])}
        </DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText
            id="alert-dialog-description"
            className={classes.content}
          >
            {t(
              [
                `error.${errorKey}.description`,
                errorInfo.serverKey
                  ? 'error.oops.server_description'
                  : 'error.oops.description'
              ],
              {
                serverKey: errorInfo.serverKey
              }
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {setError && (
            <Button onClick={handleClose} variant="outlined">
              {t('action.close')}
            </Button>
          )}
          {errorInfo.retryable && (
            <Button onClick={handleReload} variant="contained">
              {t('action.refresh')}
            </Button>
          )}
          {!errorInfo.retryable && (
            <Button onClick={handleGoHome} variant="contained">
              {t('action.home')}
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default RequestError
