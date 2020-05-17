import React from 'react'
import IdentityColours from '~/lib/identity-colours'
import RoomPlayer from '~/components/room/player'

const RoomPlayerManager = ({
  player,
  roomState,
  mePlayer,
  myTurns,
  challengerPlayer,
  setError
}) => {
  const allTurns = roomState.all_turns || []

  const playerTurns = React.useMemo(() => {
    return allTurns.filter(turn => turn.player_id === player.id)
  }, [player, allTurns])

  const isNext =
    player.id === roomState.next_player_id ||
    player.id === roomState.challenger_player_id

  const colourClass = React.useMemo(() => {
    return IdentityColours.getColourClass(player)
  }, [player])

  return (
    <RoomPlayer
      player={player}
      outcome={roomState.outcome}
      mePlayer={mePlayer}
      myTurns={myTurns}
      challengerPlayer={challengerPlayer}
      colourClass={colourClass}
      isNext={isNext}
      playerTurns={playerTurns}
      setError={setError}
    />
  )
}

export default RoomPlayerManager
