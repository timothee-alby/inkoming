import React from 'react'
import { Grid, Box, Typography } from '@material-ui/core'

const RoomPlayersList = ({ players = [] }) => {
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
    <Box display="flex" justifyContent="center" paddingTop={4}>
      <Typography variant="h5" component="h2">
        {players.length} players:
        <Grid container spacing={2}>
          {players.map(player => (
            <Grid item xs={12} key={player.player_id}>
              {player.nickname}
            </Grid>
          ))}
        </Grid>
      </Typography>
    </Box>
  )
}

export default RoomPlayersList
