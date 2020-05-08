import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'
import PlayingCard from '~/components/room/playing-card'
import IconButtonCard from '~/components/elements/icon-button-card'

const useStyles = makeStyles(theme => ({
  button: {
    padding: theme.spacing(1),
    margin: theme.spacing(1)
  },
  buttonRevealed: {
    backgroundColor: 'transparent!important' // FIXME
  },
  playingCard: {
    fontSize: 40
  },
  turnStacked: {
    marginRight: theme.spacing(5) * -1
  }
}))

const RoomPlayerTurn = ({
  roomState,
  mePlayer,
  turn,
  stacked,
  challengerPlayer,
  setError
}) => {
  const classes = useStyles()
  const { userJwt } = useAuth()
  const [cardDisabled, setCardDisabled] = React.useState(true)

  React.useEffect(() => {
    if (!roomState) return

    if (
      roomState.outcome || // the round has ended
      !challengerPlayer || // no challenger
      turn.revealed || // card already revealed
      challengerPlayer.id !== mePlayer.id // only the challenger can reveal cards
    ) {
      return setCardDisabled(true)
    }

    if (challengerPlayer.revealed_cards < challengerPlayer.carded_cards) {
      // challenger must reveal their own cards first
      return setCardDisabled(challengerPlayer.id !== turn.player_id)
    }

    setCardDisabled(false)
  }, [roomState, challengerPlayer, turn, stacked, mePlayer])

  const handleClick = async theTurn => {
    try {
      await milou({
        method: 'POST',
        url: `${process.env.API_URL}/rpc/reveal_card`,
        jwt: userJwt,
        body: {
          player_id: mePlayer.id,
          target_player_id: theTurn.player_id
        }
      })
    } catch (error) {
      setError(error)
    }
  }

  return (
    <Box className={clsx({ [classes.turnStacked]: stacked && !turn.revealed })}>
      <IconButtonCard
        aria-label={turn.colour || 'unknown'}
        disabled={cardDisabled}
        className={clsx({
          [classes.button]: true,
          [classes.buttonRevealed]: turn.revealed
        })}
        onClick={() => handleClick(turn)}
      >
        <PlayingCard colour={turn.card} className={classes.playingCard} />
      </IconButtonCard>
    </Box>
  )
}

export default RoomPlayerTurn
