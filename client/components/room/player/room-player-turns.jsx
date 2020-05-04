import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import RoomPlayerTurn from '~/components/room/player/room-player-turn'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center'
  }
}))

const RoomPlayerTurns = ({ roomState, mePlayer, turns, setError }) => {
  const classes = useStyles()
  const [cardTurns, setCardTurns] = React.useState([])
  const [unknownCardTurns, setUnknownCardTurns] = React.useState([])

  React.useEffect(() => {
    if (turns && turns.length) {
      setCardTurns(turns.filter(turn => !turn.bet && !turn.fold))
    } else {
      setCardTurns([])
    }
  }, [turns])

  React.useEffect(() => {
    if (cardTurns && cardTurns.length) {
      setUnknownCardTurns(cardTurns.filter(turn => !turn.card))
    } else {
      setUnknownCardTurns([])
    }
  }, [cardTurns])

  return (
    <Box className={classes.root}>
      {cardTurns.map((turn, idx) => (
        <Box key={turn.id}>
          <RoomPlayerTurn
            roomState={roomState}
            mePlayer={mePlayer}
            turn={turn}
            stacked={idx < unknownCardTurns.length - 1}
            setError={setError}
          />
        </Box>
      ))}
    </Box>
  )
}

export default RoomPlayerTurns
