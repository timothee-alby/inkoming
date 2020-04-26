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
  const classes = useStyles()
  const [isOpen, setIsOpen] = React.useState(true)
  const router = useRouter()

  const handleClose = () => {
    setIsOpen(false)
    setError && setError(null)
  }

  const handleReload = () => {
    router.reload()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box className={classes.container}>
        <DialogTitle id="alert-dialog-title">{error || 'Oops'}</DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText
            id="alert-dialog-description"
            className={classes.content}
          >
            Something went wrong. That&apos;s all I know.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
          <Button onClick={handleReload} variant="contained">
            Reload Page
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default RequestError
