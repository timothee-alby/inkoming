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
import UranusIcon from '~/components/icons/uranus-icon'
import MarsIcon from '~/components/icons/mars-icon'
import MeteoriteFallingAnimation from '~/components/animations/meteorite-falling'
import AlienHappyIcon from '~/components/icons/alien-happy-icon'

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
  text: {
    color: theme.palette.common.white
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
  backgroundIcon: {
    position: 'absolute',
    width: '75%',
    height: 'auto',
    top: '-100px',
    left: '-50px',
    zIndex: 10,
    transform: 'rotate(-30deg)'
  }
}))

const RoundResetDialog = ({
  resetRound,
  isDialogOpen,
  setIsDialogOpen,
  roomState
}) => {
  const classes = useStyles()
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
      classes={{ paper: classes.paper }}
      open={isDialogOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle
        id="form-dialog-title"
        classes={{
          root: clsx([
            classes.section,
            classes.text,
            classes.pole,
            classes.north
          ])
        }}
      >
        {t(`player ${roomState.outcome} round`, {
          nickname: challengerPlayerNickname
        })}
      </DialogTitle>
      <DialogContent classes={{ root: clsx([classes.section]) }}>
        <DialogContentText classes={{ root: classes.text }}>
          {t(`player ${roomState.outcome} round description`, {
            nickname: challengerPlayerNickname
          })}
        </DialogContentText>
        <DialogContentText classes={{ root: classes.text }}>
          {t('start new round')}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        classes={{ root: clsx([classes.section, classes.pole, classes.south]) }}
      >
        <Button onClick={handleClose} disabled={inflight}>
          {t('action.close')}
        </Button>
        <Button
          color="secondary"
          type="submit"
          variant="contained"
          disabled={inflight}
          onClick={handleReset}
        >
          {t('reset round')}
        </Button>
      </DialogActions>

      {roomState.outcome === 'won' && (
        <AlienHappyIcon className={classes.backgroundIcon} />
      )}
      {roomState.outcome === 'won' && (
        <UranusIcon className={classes.background} />
      )}
      {roomState.outcome === 'lost' && (
        <MarsIcon className={classes.background} />
      )}
      {roomState.outcome === 'lost' && <MeteoriteFallingAnimation />}
    </Dialog>
  )
}

export default RoundResetDialog
