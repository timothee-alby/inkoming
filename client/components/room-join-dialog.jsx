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
import { useAuth } from './auth'
import milou from '../lib/milou'
import RequestError from './request-error'

const RoomJoinDialog = ({ room }) => {
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
          room_id: room.id,
          nickname: userName
        }
      })
      router.reload()
    } catch (error) {
      setError(error)
    }
  }

  const handleBail = e => {
    setInflight(true)
    router.push('/')
  }

  if (error) {
    return <RequestError setError={setError} />
  }

  return (
    <Dialog open aria-labelledby="form-dialog-title">
      {inflight && <LinearProgress />}
      <DialogContent>
        <DialogContentText>
          You are not a player in this room yet. Fancy joinning&#63;
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBail} disabled={inflight}>
          Nah
        </Button>
        <Button
          color="primary"
          type="submit"
          variant="contained"
          disabled={inflight}
          onClick={handleJoin}
        >
          Let&apos;s go!
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoomJoinDialog
