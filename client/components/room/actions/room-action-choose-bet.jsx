import OError from '@overleaf/o-error'
import React from 'react'
import { ButtonGroup, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'

const useStyles = makeStyles(theme => ({
  group: {
    '&:not(:first-child)': {
      borderLeftStyle: 'solid',
      borderLeftWidth: '1px',
      borderLeftColor: theme.palette.primary.dark
    }
  },
  button: {
    '&.Mui-disabled': {
      backgroundColor: theme.palette.primary.dark
    }
  }
}))

const RoomActionChooseBet = ({ roomState, player, setOpen, setError }) => {
  const classes = useStyles()
  const { userJwt } = useAuth()

  const handleClick = async bet => {
    try {
      await milou({
        method: 'POST',
        url: `${process.env.API_URL}/turns`,
        jwt: userJwt,
        body: {
          player_id: player.id,
          bet
        }
      })
      setOpen(false)
    } catch (error) {
      setError(
        OError.tag(error, 'cannot bet', {
          clientContextKey: 'bet',
          retryable: true
        })
      )
    }
  }

  const numBets = roomState.max_bet - roomState.min_bet + 1
  const groupSize = Math.min(numBets, 5)
  const startBet = Math.max(roomState.min_bet - (numBets % groupSize), 1)

  return (
    <>
      {[...Array(Math.ceil(numBets / groupSize))].map((_, groupId) => (
        <ButtonGroup
          key={groupId}
          className={classes.group}
          color="primary"
          orientation="vertical"
          variant="contained"
        >
          {[...Array(groupSize)].map((_, idx) => {
            const bet = startBet + groupId * groupSize + idx
            return (
              <Button
                key={idx}
                className={classes.button}
                disabled={bet < roomState.min_bet || bet > roomState.max_bet}
                onClick={() => handleClick(bet)}
              >
                {bet}
              </Button>
            )
          })}
        </ButtonGroup>
      ))}
    </>
  )
}

export default RoomActionChooseBet
