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
import { useAuth } from '~/components/auth/auth-context'
import { useTranslation } from 'react-i18next'

const AuthDialog = () => {
  const { t } = useTranslation()
  const { userJwt, userName, setUserName } = useAuth()
  const [tempName, setTempName] = React.useState('')
  const [inflight, setInflight] = React.useState(false)

  React.useEffect(() => {
    if (userName) {
      setTempName(userName)
    }
  }, [userName])

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
        <DialogTitle id="form-dialog-title">{t('welcome')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('welcome message')}</DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label={t('nickname')}
            type="text"
            fullWidth
            variant="outlined"
            value={tempName}
            autoComplete="off"
            onChange={e => setTempName(e.target.value)}
            disabled={inflight}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            type="submit"
            variant="contained"
            disabled={inflight}
          >
            {t('set nickname')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AuthDialog
