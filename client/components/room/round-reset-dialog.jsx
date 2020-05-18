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

const RoundResetDialog = ({
  resetRound,
  isDialogOpen,
  setIsDialogOpen,
  roomState
}) => {
  const { t } = useTranslation()
  const [
    challengerPlayerNickname,
    setChallengerPlayerNickname
  ] = React.useState('')
  const [inflight, setInflight] = React.useState(false)

  React.useEffect(() => {
    if (roomState && roomState.outcome) {
      setChallengerPlayerNickname(
        roomState.all_players.find(
          player => player.id === roomState.challenger_player_id
        ).nickname
      )
    }
  }, [roomState])

  const handleReset = e => {
    setInflight(true)
    resetRound()
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
      <DialogTitle id="form-dialog-title">
        {t(`player ${roomState.outcome} round`, {
          nickname: challengerPlayerNickname
        })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{t('start new round')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={inflight}>
          {t('action.close')}
        </Button>
        <Button
          color="primary"
          type="submit"
          variant="contained"
          disabled={inflight}
          onClick={handleReset}
        >
          {t('reset round')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoundResetDialog
