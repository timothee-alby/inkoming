import React from 'react'
import CardRedIcon from '~/components/icons/card-red-icon'
import CardBlackIcon from '~/components/icons/card-black-icon'
import CardUnknownIcon from '~/components/icons/card-unknown-icon'

const PlayingCard = props => {
  const { colour, ...iconProps } = props
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
  return <CardIcon {...iconProps} />
}

export default PlayingCard
