import React from 'react'
import { Grid, Box, Typography } from '@material-ui/core'
import RoomPlayer from '~/components/room/room-player'

const RoomPlayersList = ({ roomState }) => {
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
    <Box display="flex" justifyContent="center">
      <Grid container spacing={2}>
        {players.map(player => (
          <Grid item xs={12} key={player.id}>
            <RoomPlayer player={player} roomState={roomState} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default RoomPlayersList
