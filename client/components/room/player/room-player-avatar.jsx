import React from 'react'
import clsx from 'clsx'
import { Avatar, Badge } from '@material-ui/core'
import IdentityColours from '~/lib/identity-colours'

const RoomPlayerAvatar = ({ playerPoints, playerNickname, colourClass }) => {
  const identityColoursClasses = IdentityColours.useStyles()

  return (
    <Badge
      color="primary"
      badgeContent={playerPoints}
      showZero={false}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
    >
      <Avatar
        aria-label={playerNickname}
        variant="rounded"
        className={clsx(
          identityColoursClasses[colourClass],
          'identity-colour-reverse'
        )}
      >
        {playerNickname[0].toUpperCase()}
        {playerNickname[1].toLowerCase()}
      </Avatar>
    </Badge>
  )
}

export default RoomPlayerAvatar
