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
  const [showMyCards, setShowMyCards] = React.useState(false)
  const [canShowMyCards, setCanShowMyCards] = React.useState(true)
  const allTurns = roomState.all_turns || []

  const playerTurns = React.useMemo(() => {
    return allTurns.filter(turn => turn.player_id === player.id)
  }, [player, allTurns])

  React.useEffect(() => {
    if (!challengerPlayer) {
      setCanShowMyCards(true)
    } else {
      setCanShowMyCards(false)
      setShowMyCards(false)
    }
  }, [challengerPlayer])

  const isNext = player.id === roomState.next_player_id
  const isChallenger = player.id === roomState.challenger_player_id

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
      isChallenger={isChallenger}
      playerTurns={playerTurns}
      showMyCards={showMyCards}
      setShowMyCards={setShowMyCards}
      canShowMyCards={canShowMyCards}
      setError={setError}
    />
  )
}

export default RoomPlayerManager
