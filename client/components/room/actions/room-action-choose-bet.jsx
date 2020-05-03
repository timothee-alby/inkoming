import React from 'react'
import { ButtonGroup, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'

const useStyles = makeStyles(theme => ({
  root: {}
}))

const RoomActionChooseBet = ({ roomState, player, setOpen, setError }) => {
  const classes = useStyles()
  const { userJwt } = useAuth()

  React.useEffect(() => {}, [])

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
      setError(error)
    }
  }

  return (
    <ButtonGroup
      className={classes.root}
      color="primary"
      aria-label="vertical contained primary button group"
      variant="contained"
    >
      {[...Array(roomState.max_bet - roomState.min_bet + 1)].map((_, idx) => (
        <Button
          key={roomState.min_bet + idx}
          onClick={() => handleClick(roomState.min_bet + idx)}
        >
          {roomState.min_bet + idx}
        </Button>
      ))}
    </ButtonGroup>
  )
}

export default RoomActionChooseBet
