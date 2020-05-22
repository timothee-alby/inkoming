import React from 'react'
import RoomNotification from '~/components/room/notification'

const RoomNotificationsManager = ({ notifications, setNotifications }) => {
  const [open, setOpen] = React.useState(false)
  const [notification, setNotification] = React.useState(undefined)

  const handleExited = () => {
    setNotification(undefined)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  React.useEffect(() => {
    if (!notifications.length) return

    if (!notification) {
      // Set a new notification when we don't have an active one
      setNotification(notifications[0])
      setNotifications(prev => prev.slice(1))
      setOpen(true)
    } else if (notification && open) {
      // Close an active notification when a new one is added
      setOpen(false)
    }
  }, [notifications, notification, open, setNotifications, setNotification])

  return (
    <RoomNotification
      open={open}
      handleClose={handleClose}
      handleExited={handleExited}
      notification={notification}
    />
  )
}

export default RoomNotificationsManager
