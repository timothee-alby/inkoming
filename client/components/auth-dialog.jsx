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
import { useAuth } from '~/components/auth'

const AuthDialog = () => {
  const { userJwt, userName, setUserName } = useAuth()
  const [tempName, setTempName] = React.useState('')
  const [inflight, setInflight] = React.useState(false)

  React.useEffect(() => {
    if (!userJwt && userName) {
      setInflight(true)
    }
  }, [userJwt, userName])

  const handleSubmit = e => {
    e.preventDefault()
    if (!tempName) return false

    setUserName(tempName)
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
            value={tempName || userName}
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
