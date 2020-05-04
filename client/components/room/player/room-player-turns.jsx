import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PlayingCard from '~/components/room/playing-card'
import IconButtonTernary from '~/components/elements/icon-button-ternary'

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
          {!turn.bet && (
            <IconButtonTernary aria-label={turn.colour || 'unknown'} disabled>
              <PlayingCard
                colour={turn.colour}
                className={classes.playingCard}
              />
            </IconButtonTernary>
          )}
        </Box>
      ))}
    </>
  )
}

export default RoomPlayer
