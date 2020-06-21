import React from 'react'
import { useAuth } from '~/components/auth/auth-context'
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

const RoomTutorialManager = ({ roomState }) => {
  const { isBeginner, setIsBeginner, tutorialCloseCount } = useAuth()
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

  React.useEffect(() => {
    if (!isBeginner && tutorialCloseCount < 20) {
      setIsBeginner(true)
    }
  }, [gameCurrentStepId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <RoomTutorial
      roomState={roomState}
      steps={steps}
      gameCurrentStepId={gameCurrentStepId}
    />
  )
}

export default RoomTutorialManager
