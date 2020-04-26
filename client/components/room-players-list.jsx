import React from 'react'
import { Grid, Box, Typography } from '@material-ui/core'

const RoomPlayersList = ({ room }) => {
  if (room.players.length === 0) {
    return (
      <Box display="flex" justifyContent="center" paddingTop={4}>
        <Typography variant="h5" component="h2">
          No players.
        </Typography>
      </Box>
    )
  }

  return (
    <Box display="flex" justifyContent="center" paddingTop={4}>
      <Typography variant="h5" component="h2">
        {room.players.length} players:
        <Grid container spacing={2}>
          {room.players.map(player => (
            <Grid item xs={12} key={player.id}>
              {player.nickname}
            </Grid>
          ))}
        </Grid>
      </Typography>
    </Box>
  )
}

export default RoomPlayersList
