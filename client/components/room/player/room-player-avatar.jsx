import React from 'react'
import clsx from 'clsx'
import { Avatar, Badge } from '@material-ui/core'
import IdentityColours from '~/lib/identity-colours'

const RoomPlayerAvatar = ({ player }) => {
  const identityColoursClasses = IdentityColours.useStyles()
  const [colourClass, setColourClass] = React.useState()

  React.useEffect(() => {
    setColourClass(IdentityColours.getColourClass(player))
  }, [player])

  return (
    <Badge
      color="primary"
      badgeContent={player.points}
      showZero={false}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
    >
      <Avatar
        aria-label={player.nickname}
        variant="rounded"
        className={clsx(
          identityColoursClasses[colourClass],
          'identity-colour-reverse'
        )}
      >
        {player.nickname[0].toUpperCase()}
        {player.nickname[1].toLowerCase()}
      </Avatar>
    </Badge>
  )
}

export default RoomPlayerAvatar
