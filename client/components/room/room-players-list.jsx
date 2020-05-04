import React from 'react'
import { Container, Grid, Box, Typography } from '@material-ui/core'
import RoomPlayer from '~/components/room/room-player'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: `calc(100vh - ${theme.spacing(12)}px)`
  }
}))

const RoomPlayersList = ({ roomState }) => {
  const classes = useStyles()
  const players = roomState.all_players || []

  if (players.length === 0) {
    return (
      <Box display="flex" justifyContent="center" paddingTop={4}>
        <Typography variant="h5" component="h2">
          No players.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="space-around"
      className={classes.root}
    >
      {players.map(player => (
        <Box key={player.id}>
          <RoomPlayer player={player} roomState={roomState} />
        </Box>
      ))}
    </Box>
  )
}

export default RoomPlayersList
