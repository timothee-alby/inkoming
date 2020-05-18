import React from 'react'
import { Snackbar, IconButton, Slide } from '@material-ui/core/'
import CloseIcon from '@material-ui/icons/Close'
import { useTranslation } from 'react-i18next'

const SnackbarAction = ({ handleClose }) => {
  const { t } = useTranslation()
  return (
    <IconButton
      size="small"
      aria-label={t('close')}
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  )
}

const RoomNotification = ({ notification }) => {
  const [open, setOpen] = React.useState(true)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  if (!notification) return null

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={notification.text}
      action={<SnackbarAction handleClose={handleClose} />}
      TransitionComponent={props => <Slide {...props} direction="up" />}
    />
  )
}

export default RoomNotification
