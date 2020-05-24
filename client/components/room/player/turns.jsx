import React from 'react'
import { Box } from '@material-ui/core'
import RoomPlayerTurn from '~/components/room/player/turn'

const RoomPlayerTurns = ({
  outcome,
  mePlayer,
  turns,
  challengerPlayer,
  setError
}) => {
  const [cardTurns, setCardTurns] = React.useState([])
  const [hiddenCardTurns, setHiddenCardTurns] = React.useState(0)

  React.useEffect(() => {
    if (turns && turns.length) {
      setCardTurns(turns.filter(turn => !turn.bet && !turn.fold))
    } else {
      setCardTurns([])
    }
  }, [turns])

  React.useEffect(() => {
    if (cardTurns && cardTurns.length) {
      setHiddenCardTurns(cardTurns.filter(turn => !turn.revealed).length)
    } else {
      setHiddenCardTurns(0)
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
            stacked={idx < hiddenCardTurns - 1}
            challengerPlayer={challengerPlayer}
            setError={setError}
          />
        </Box>
      ))}
    </>
  )
}

export default RoomPlayerTurns
