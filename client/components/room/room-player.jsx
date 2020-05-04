import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  LinearProgress
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import RoomPlayerAvatar from '~/components/room/player/room-player-avatar'
import RoomPlayerTurns from '~/components/room/player/room-player-turns'

const useStyles = makeStyles(theme => ({
  content: {
    textAlign: 'center'
  }
}))

const RoomPlayer = ({ player, roomState }) => {
  const classes = useStyles()
  const isNext = player.id === roomState.next_player_id

  return (
    <Card>
      <CardHeader
        title={player.nickname}
        variant="rounded"
        avatar={<RoomPlayerAvatar player={player} />}
        subheader={`${player.total_cards} cards`}
      ></CardHeader>
      <CardContent className={classes.content}>
        <RoomPlayerTurns player={player} allTurns={roomState.all_turns} />
      </CardContent>
      {isNext && <LinearProgress />}
    </Card>
  )
}

export default RoomPlayer
