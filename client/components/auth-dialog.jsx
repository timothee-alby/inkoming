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

const AuthDialog = ({ setUserName }) => {
  const [tempName, setTempName] = React.useState('')
  const [inflight, setInflight] = React.useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    if (!tempName) return false

    setUserName(tempName)
    setInflight(true)
    return false
  }

  return (
    <Dialog open aria-labelledby="form-dialog-title">
      {inflight && <LinearProgress />}
      <form onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">Welcome</DialogTitle>
        <DialogContent>
          <DialogContentText>
            It looks like you are new here, Please enter a nickname to proceed.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nickname"
            type="text"
            fullWidth
            variant="outlined"
            value={tempName}
            onChange={e => setTempName(e.target.value)}
            disabled={inflight}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" type="submit" disabled={inflight}>
            Set my nickname
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AuthDialog
