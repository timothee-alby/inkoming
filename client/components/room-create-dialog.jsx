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

const RoomCreateDialog = ({ createRoom, isDialogOpen, setIsDialogOpen }) => {
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
        <DialogTitle id="form-dialog-title">New Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Let&apos;s create a new room. It just needs a name.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Room name"
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
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            variant="contained"
            disabled={inflight}
          >
            Set room name
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RoomCreateDialog
