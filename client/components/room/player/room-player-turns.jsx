import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PlayingCard from '~/components/room/playing-card'

const useStyles = makeStyles(theme => ({
  playingCard: {
    fontSize: 40
  }
}))

const RoomPlayer = ({ turns }) => {
  const classes = useStyles()
  if (!turns.length) return null

  return (
    <>
      {turns.map(turn => (
        <Box key={turn.id}>
          {!turn.bet && <PlayingCard className={classes.playingCard} />}
        </Box>
      ))}
    </>
  )
}

export default RoomPlayer
