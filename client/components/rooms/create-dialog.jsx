import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  LinearProgress
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'

const RoomCreateDialog = ({ createRoom, isDialogOpen, setIsDialogOpen }) => {
  const { t } = useTranslation()
  const [tempName, setTempName] = React.useState('')
  const [inflight, setInflight] = React.useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    if (!tempName) return false

    setInflight(true)
    createRoom(tempName)
    return false
  }

  const handleClose = () => {
    setIsDialogOpen(false)
  }

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      {inflight && <LinearProgress />}
      <form onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">{t('new room')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('create a new room')}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={t('room name')}
            type="text"
            fullWidth
            variant="outlined"
            value={tempName}
            onChange={e => setTempName(e.target.value)}
            disabled={inflight}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={inflight}>
            {t('action.cancel')}
          </Button>
          <Button
            color="primary"
            type="submit"
            variant="contained"
            disabled={inflight}
          >
            {t('set room name')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RoomCreateDialog
