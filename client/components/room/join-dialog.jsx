import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  LinearProgress
} from '@material-ui/core'
import { useRouter } from 'next/router'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'
import RequestError from '~/components/request-error'
import { useTranslation } from 'react-i18next'

const RoomJoinDialog = ({ roomId, setHasJoined }) => {
  const { t } = useTranslation()
  const [inflight, setInflight] = React.useState(false)
  const [error, setError] = React.useState(null)
  const { userJwt, userId, userName } = useAuth()
  const router = useRouter()

  const handleJoin = async e => {
    setInflight(true)

    try {
      await milou({
        method: 'POST',
        url: `${process.env.API_URL}/players`,
        jwt: userJwt,
        body: {
          user_id: userId,
          room_id: roomId,
          nickname: userName
        }
      })
    } catch (error) {
      setError(error)
    }
    setHasJoined(true)
  }

  const handleBail = e => {
    setInflight(true)
    router.push('/')
  }

  if (error) {
    return <RequestError />
  }

  return (
    <Dialog open aria-labelledby="form-dialog-title">
      {inflight && <LinearProgress />}
      <DialogContent>
        <DialogContentText>{t('not a player yet')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBail} disabled={inflight}>
          {t('action.no')}
        </Button>
        <Button
          color="primary"
          type="submit"
          variant="contained"
          disabled={inflight}
          onClick={handleJoin}
        >
          {t('action.go')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoomJoinDialog
