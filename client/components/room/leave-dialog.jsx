import OError from '@overleaf/o-error'
import React from 'react'
import Router from 'next/router'
import milou from '~/lib/milou'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from '~/components/auth/auth-context'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  leaveButton: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.main
    }
  }
}))

const RoomLeaveDialog = ({
  playerId,
  isDialogOpen,
  setIsDialogOpen,
  setError
}) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { userJwt } = useAuth()
  const [inflight, setInflight] = React.useState(false)

  const handleClose = () => {
    setIsDialogOpen(false)
  }

  const handleLeave = async () => {
    setInflight(true)
    try {
      await milou({
        method: 'DELETE',
        url: `${process.env.API_URL}/players?id=eq.${playerId}`,
        jwt: userJwt
      })
      Router.push(`/rooms`)
    } catch (error) {
      setInflight(false)
      setError(
        OError.tag(error, 'cannot leave room', {
          clientContextKey: 'leave_room',
          retryable: true
        })
      )
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{t('leave room')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('leave room description')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={inflight}>
          {t('action.no')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={inflight}
          onClick={handleLeave}
          className={classes.leaveButton}
        >
          {t('action.leave')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoomLeaveDialog
