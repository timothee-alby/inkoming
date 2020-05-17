import React from 'react'
import MeteoriteFallingAnimation from '~/components/animations/meteorite-falling'
import AlienHappyAnimation from '~/components/animations/alien-happy'

const RoomPlayerOutcome = ({ isChallenger, outcome }) => {
  if (!outcome) return null

  if (!isChallenger) return null

  if (outcome === 'won') return <AlienHappyAnimation />

  if (outcome === 'lost') return <MeteoriteFallingAnimation />

  return null
}

export default RoomPlayerOutcome
