import React from 'react'
import clsx from 'clsx'
import { CardHeader } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import IdentityColours from '~/lib/identity-colours'
import RoomPlayerAvatar from '~/components/room/player/avatar'
import RoomPlayerHeaderTitle from '~/components/room/player/header/title'
import RoomPlayerHeaderSubheader from '~/components/room/player/header/subheader'
import RoomPlayerHeaderAction from '~/components/room/player/header/action'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1)
  },
  content: {
    lineHeight: 0
  },
  action: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(8)
  }
}))

const RoomPlayerHeader = ({
  playerNickname,
  playerPoints,
  playerTotalCards,
  playerCardedCards,
  colourClass,
  playerTurns
}) => {
  const classes = useStyles()
  const identityColoursClasses = IdentityColours.useStyles()

  return (
    <CardHeader
      title={<RoomPlayerHeaderTitle playerNickname={playerNickname} />}
      avatar={
        <RoomPlayerAvatar
          playerNickname={playerNickname}
          playerPoints={playerPoints}
          colourClass={colourClass}
        />
      }
      subheader={
        <RoomPlayerHeaderSubheader
          playerTotalCards={playerTotalCards}
          playerCardedCards={playerCardedCards}
        />
      }
      action={<RoomPlayerHeaderAction turns={playerTurns} />}
      className={clsx(classes.root, identityColoursClasses[colourClass])}
      classes={{
        action: classes.action,
        content: classes.content
      }}
      disableTypography={true}
    ></CardHeader>
  )
}

export default RoomPlayerHeader
