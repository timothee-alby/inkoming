import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  LinearProgress
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'

const RoomResetDialog = ({ resetRoom, gameWinnerPlayerId, allPlayers }) => {
  const { t } = useTranslation()
  const [
    gameWinnerPlayerNickname,
    setGameWinnerPlayerNickname
  ] = React.useState('')
  const [inflight, setInflight] = React.useState(false)

  React.useMemo(() => {
    setGameWinnerPlayerNickname(
      allPlayers.find(player => player.id === gameWinnerPlayerId).nickname
    )
  }, [allPlayers, gameWinnerPlayerId])

  const handleReset = e => {
    setInflight(true)
    resetRoom()
  }

  return (
    <Dialog open={true} aria-labelledby="form-dialog-title">
      {inflight && <LinearProgress />}
      <DialogTitle id="form-dialog-title">
        {t('player won game', { nickname: gameWinnerPlayerNickname })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{t('start new game')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          type="submit"
          variant="contained"
          disabled={inflight}
          onClick={handleReset}
        >
          {t('reset room')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoomResetDialog
