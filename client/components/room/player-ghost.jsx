import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  LinearProgress
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'
import RoomPlayerTurnGhost from '~/components/room/player/turn-ghost'

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(1)
  },
  content: {
    display: 'flex',
    justifyContent: 'center'
  },
  progress: {
    marginTop: theme.spacing(0.5) * -1
  }
}))

const RoomPlayerGhost = () => {
  const classes = useStyles()

  return (
    <Card>
      <CardHeader
        className={classes.header}
        title={<Skeleton variant="text" width={80} />}
        avatar={<Skeleton variant="rect" width={40} height={40} />}
        subheader={<Skeleton variant="text" width={50} />}
      ></CardHeader>
      <CardContent className={classes.content}>
        <RoomPlayerTurnGhost />
      </CardContent>
      {<LinearProgress className={classes.progress} />}
    </Card>
  )
}

export default RoomPlayerGhost
