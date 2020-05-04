import React from 'react'
import CardRedIcon from '~/components/icons/card-red-icon'
import CardBlackIcon from '~/components/icons/card-black-icon'
import CardUnknownIcon from '~/components/icons/card-unknown-icon'

const PlayingCard = ({ colour, className }) => {
  let CardIcon = null
  switch (colour) {
    case 'red':
      CardIcon = CardRedIcon
      break
    case 'black':
      CardIcon = CardBlackIcon
      break
    default:
      CardIcon = CardUnknownIcon
  }
  return <CardIcon className={className} />
}

export default PlayingCard
