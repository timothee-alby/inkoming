import React from 'react'
import { Box, Typography } from '@material-ui/core'
import ChallengerIcon from '~/components/icons/challenger-icon'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.ternary.main,
    color: theme.palette.ternary.contrastText,
    display: 'flex',
    padding: theme.spacing(1)
  },
  icon: {
    marginTop: theme.spacing(0.5)
  },
  title: {
    marginLeft: theme.spacing(1)
  }
}))

const RoomPlayerAbove = ({ isChallenger }) => {
  const classes = useStyles()

  if (!isChallenger) return null

  return (
    <Box title="Challenger" className={classes.root}>
      <ChallengerIcon className={classes.icon} />
      <Typography variant="h6" className={classes.title}>
        Challenger
      </Typography>
    </Box>
  )
}

export default RoomPlayerAbove
