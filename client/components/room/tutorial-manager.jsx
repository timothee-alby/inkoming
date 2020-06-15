import React from 'react'
import RoomTutorial from '~/components/room/tutorial'

const steps = [
  'intro',
  'invite',
  'ready',
  'turns',
  'bets',
  'challenge',
  'outcome'
]

const RoomTutorialManager = ({
  roomState,
  showTutorialDescription,
  setShowTutorialDescription
}) => {
  const gameCurrentStepId = React.useMemo(() => {
    if (roomState.outcome) {
      return 6 // outcome
    }
    if (roomState.challenger_player_id) {
      return 5 // challenge
    }
    if (roomState.all_players.length < 2) {
      return 1 // invite
    }
    if (roomState.can_card) {
      if (roomState.can_bet) {
        return 3 // turns
      }
      return 2 // ready
    }
    if (!roomState.can_card && roomState.can_bet) {
      return 4 // bets
    }
  }, [roomState])

  return (
    <RoomTutorial
      roomState={roomState}
      steps={steps}
      gameCurrentStepId={gameCurrentStepId}
      showDescription={showTutorialDescription}
      setShowDescription={setShowTutorialDescription}
    />
  )
}

export default RoomTutorialManager
