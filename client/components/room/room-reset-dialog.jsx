import React from 'react'
import clsx from 'clsx'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import EarthIcon from '~/components/icons/earth-icon'
import RoomPlayerAvatar from '~/components/room/player/avatar'
import IdentityColours from '~/lib/identity-colours'

const useStyles = makeStyles(theme => ({
  paper: {
    overflowY: 'unset',
    background: 'none',
    boxShadow: 'none',
    justifyContent: 'center',
    alignItems: 'center'
  },
  section: {
    zIndex: 15,
    textAlign: 'center',
    justifyContent: 'center'
  },
  pole: {
    width: '75%'
  },
  north: {
    marginTop: theme.spacing(3),
    maxWidth: theme.spacing(30),
    overflow: 'hidden'
  },
  south: {
    marginBottom: theme.spacing(3)
  },
  background: {
    position: 'absolute',
    height: 'auto',
    width: 'auto',
    zIndex: 10
  },
  backgroundIconOuter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateY(-200px)',
    animation:
      'spaceship-in 0.8s linear 1, spaceship-orbit 4s linear infinite 3s',
    zIndex: 15
  },
  backgroundIconInner: {
    marginLeft: '-50%',
    animation: 'spaceship-vibrate 0.3s linear infinite both'
  }
}))

const RoomResetDialog = ({ resetRoom, gameWinnerPlayerId, allPlayers }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const [inflight, setInflight] = React.useState(false)

  const gameWinnerPlayer = React.useMemo(() => {
    return allPlayers.find(player => player.id === gameWinnerPlayerId)
  }, [allPlayers, gameWinnerPlayerId])

  const handleReset = e => {
    setInflight(true)
    resetRoom()
  }

  return (
    <Dialog
      classes={{ paper: classes.paper }}
      open={true}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle
        classes={{
          root: clsx([classes.section, classes.pole, classes.north])
        }}
        id="form-dialog-title"
      >
        {t('player won game', { nickname: gameWinnerPlayer.nickname })}
      </DialogTitle>
      <DialogContent classes={{ root: clsx([classes.section]) }}>
        <DialogContentText>
          {t('player won game description', {
            nickname: gameWinnerPlayer.nickname
          })}
        </DialogContentText>
        <DialogContentText>{t('start new game')}</DialogContentText>
      </DialogContent>
      <DialogActions
        classes={{ root: clsx([classes.section, classes.pole, classes.south]) }}
      >
        <Button
          color="secondary"
          type="submit"
          variant="contained"
          disabled={inflight}
          onClick={handleReset}
        >
          {t('reset room')}
        </Button>
      </DialogActions>
      <EarthIcon className={classes.background} />
      <div className={classes.backgroundIconOuter}>
        <div className={classes.backgroundIconInner}>
          <RoomPlayerAvatar
            playerNickname={gameWinnerPlayer.nickname}
            playerPoints={2}
            colourClass={IdentityColours.getColourClass(gameWinnerPlayer)}
          />
        </div>
      </div>
    </Dialog>
  )
}

export default RoomResetDialog
