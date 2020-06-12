import OError from '@overleaf/o-error'
import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'
import PlayingCard from '~/components/room/playing-card'
import IconButtonCard from '~/components/elements/icon-button-card'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center'
  },
  playingCard: {
    fontSize: theme.spacing(8)
  },
  turnStacked: {
    marginBottom: theme.spacing(5) * -1
  }
}))

const RoomPlayerTurn = ({
  outcome,
  mePlayer,
  turn,
  stacked,
  challengerPlayer,
  setError
}) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const { userJwt } = useAuth()

  const cardCanBeRevealed = React.useMemo(() => {
    if (
      outcome || // the round has ended
      !challengerPlayer || // no challenger
      turn.revealed || // card already revealed
      stacked // the card is stacked behind another
    ) {
      return false
    }

    if (challengerPlayer.revealed_cards < challengerPlayer.carded_cards) {
      // challenger must reveal their own cards first
      return challengerPlayer.id === turn.player_id
    }

    return true
  }, [outcome, challengerPlayer, turn, stacked])

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
      setError(
        OError.tag(error, 'cannot reveal card', {
          clientContextKey: 'reveal_card',
          retryable: true
        })
      )
    }
  }

  return (
    <Box
      className={clsx({
        [classes.root]: true,
        [classes.turnStacked]: stacked && !turn.revealed
      })}
    >
      <IconButtonCard
        aria-label={t(`card.${turn.card || 'unknown'}`)}
        disabled={!cardCanBeRevealed || challengerPlayer.id !== mePlayer.id}
        onClick={() => handleClick(turn)}
        className={clsx({ 'can-be-revealed': cardCanBeRevealed })}
      >
        <PlayingCard colour={turn.card} className={classes.playingCard} />
      </IconButtonCard>
    </Box>
  )
}

export default RoomPlayerTurn
