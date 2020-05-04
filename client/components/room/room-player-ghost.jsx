import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  LinearProgress
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'
import RoomPlayerTurnGhost from '~/components/room/player/room-player-turn-ghost'

const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    justifyContent: 'center'
  }
}))

const RoomPlayerGhost = () => {
  const classes = useStyles()

  return (
    <Card>
      <CardHeader
        title={<Skeleton variant="text" width={80} />}
        avatar={<Skeleton variant="rect" width={40} height={40} />}
        subheader={<Skeleton variant="text" width={50} />}
      ></CardHeader>
      <CardContent className={classes.content}>
        <RoomPlayerTurnGhost />
      </CardContent>
      {<LinearProgress />}
    </Card>
  )
}

export default RoomPlayerGhost
