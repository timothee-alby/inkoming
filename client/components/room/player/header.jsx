import React from 'react'
import clsx from 'clsx'
import { CardHeader } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import IdentityColours from '~/lib/identity-colours'
import RoomPlayerAvatar from '~/components/room/player/room-player-avatar'
import RoomPlayerHeaderTitle from '~/components/room/player/header/room-player-header-title'
import RoomPlayerHeaderSubheader from '~/components/room/player/header/room-player-header-subheader'
import PlayingBet from '~/components/room/playing-bet'

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2)
  },
  content: {
    lineHeight: 0
  },
  action: {
    width: '40px'
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
      action={<PlayingBet turns={playerTurns} />}
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
