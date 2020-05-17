import React from 'react'
import { Box } from '@material-ui/core'
import RoomPlayerTurn from '~/components/room/player/room-player-turn'

const RoomPlayerTurns = ({
  outcome,
  mePlayer,
  turns,
  challengerPlayer,
  setError
}) => {
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
    <>
      {cardTurns.map((turn, idx) => (
        <Box key={turn.id}>
          <RoomPlayerTurn
            outcome={outcome}
            mePlayer={mePlayer}
            turn={turn}
            stacked={idx < unknownCardTurns.length - 1}
            challengerPlayer={challengerPlayer}
            setError={setError}
          />
        </Box>
      ))}
    </>
  )
}

export default RoomPlayerTurns
