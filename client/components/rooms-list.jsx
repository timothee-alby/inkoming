import React from 'react'
import { Grid, Box, Typography } from '@material-ui/core'
import { useAuth } from './auth'
import milou from '../lib/milou'
import RoomCard from './room-card'
import RoomCreate from './room-create'
import ContentLoading from './content-loading'
import RequestError from './request-error'

const RoomList = () => {
  const [error, setError] = React.useState(null)
  const [rooms, setRooms] = React.useState(null)

  if (!rooms && !error) {
    milou({
      url: `${process.env.API_URL}/rooms`,
      jwt: useAuth().userJwt
    })
      .then(setRooms)
      .catch(setError)
  }

  if (error) {
    return <RequestError setError={setError} />
  }

  if (!rooms) {
    return <ContentLoading />
  }

  if (rooms.length === 0) {
    return (
      <>
        <Box display="flex" justifyContent="center" paddingTop={4}>
          <Typography variant="h5" component="h2">
            No rooms yet. Create one maybe&#63;
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" padding={4}>
          <RoomCreate buttonVariant="contained" />
        </Box>
      </>
    )
  }

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

export default RoomList
