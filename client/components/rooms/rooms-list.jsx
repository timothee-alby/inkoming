import React from 'react'
import { Grid } from '@material-ui/core'
import RoomCard from '~/components/rooms/room-card'

const RoomsList = ({ rooms }) => {
  return (
    <Grid container spacing={2}>
      {rooms.map(room => (
        <Grid item xs={12} key={room.id}>
          <RoomCard room={room} />
        </Grid>
      ))}
    </Grid>
  )
}

export default RoomsList
