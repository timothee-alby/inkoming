import React from 'react'
import { Snackbar, IconButton, Slide } from '@material-ui/core/'
import CloseIcon from '@material-ui/icons/Close'

const RoomNotification = ({ socketPayload }) => {
  if (!socketPayload || !socketPayload.notification) return null

  const [open, setOpen] = React.useState(true)
  const notification = socketPayload.notification

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const snackbarAction = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  )

  const snackbarTransition = props => {
    return <Slide {...props} direction="up" />
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={notification}
      action={snackbarAction}
      TransitionComponent={snackbarTransition}
    />
  )
}

export default RoomNotification
