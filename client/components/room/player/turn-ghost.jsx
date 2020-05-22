import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    margin: 'auto',
    marginBottom: theme.spacing(1)
  }
}))

const RoomPlayerTurnGhost = () => {
  const classes = useStyles()

  return <Skeleton variant="circle" className={classes.root} />
}

export default RoomPlayerTurnGhost
