import React from 'react'
import { Box } from '@material-ui/core'
import PlayingCard from '~/components/room/playing-card'

const RoomPlayer = ({ player, allTurns = [] }) => {
  if (!allTurns) return null

  const playerTurns = allTurns.filter(turn => turn.player_id === player.id)

  if (!playerTurns.length) return null

  return (
    <>
      {playerTurns.map(playerTurn => (
        <Box key={playerTurn.id}>
          <PlayingCard style={{ fontSize: 40 }} />
        </Box>
      ))}
    </>
  )
}

export default RoomPlayer
