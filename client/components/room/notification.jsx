import React from 'react'
import clsx from 'clsx'
import { Snackbar, IconButton } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  contentRoot: {
    backgroundColor: theme.palette.background.header.main,
    color: theme.palette.background.header.gradient
  },
  message: {
    color: theme.palette.common.white
  },
  action: {
    color: theme.palette.common.white
  }
}))

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

const RoomNotification = ({
  open,
  handleClose,
  handleExited,
  notification
}) => {
  const { t } = useTranslation()
  const classes = useStyles()
  let key, message
  if (notification) {
    const { timestamp, payload } = notification

    const { key: translationKey, ...translationAttributes } = payload
    message = t(translationKey, translationAttributes)
    key = timestamp
  }
  console.log('notification', message, notification)

  return (
    <Snackbar
      ContentProps={{
        classes: {
          root: clsx([[classes.contentRoot], 'pattern-cross-dots-sm']),
          message: classes.message,
          action: classes.action
        }
      }}
      key={key}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      action={<SnackbarAction handleClose={handleClose} />}
      onExited={handleExited}
    />
  )
}

export default RoomNotification
