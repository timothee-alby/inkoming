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

const RoomResetDialog = ({ resetRoom, gameWinnerPlayerId, allPlayers }) => {
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
        {gameWinnerPlayerNickname} won the game!
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Let&apos;s start a new game?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          type="submit"
          variant="contained"
          disabled={inflight}
          onClick={handleReset}
        >
          Reset Game
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoomResetDialog
