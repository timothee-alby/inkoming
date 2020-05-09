import React from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.spacing(10),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  }
}))

const RommPlayerHeaderTitle = ({ player }) => {
  const classes = useStyles()

  return (
    <Typography variant="subtitle2" className={classes.root}>
      {player.nickname}
    </Typography>
  )
}

export default RommPlayerHeaderTitle
