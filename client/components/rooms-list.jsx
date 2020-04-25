import React, { useState, useEffect } from 'react'
import { Grid, Box, Typography } from '@material-ui/core'
import { useAuth } from './auth'
import { getGetHeader } from '../lib/fetch'
import RoomCard from './room-card'
import RoomCreate from './room-create'
import ContentLoading from './content-loading'

const RoomList = () => {
  const [rooms, setRooms] = useState(null)
  const { userJwt } = useAuth()

  useEffect(() => {
    const get = async () => {
      const res = await fetch(`${process.env.API_URL}/rooms`, {
        headers: getGetHeader(userJwt)
      })
      const json = await res.json()
      setRooms(json)
    }

    get()
  }, [setRooms])

  if (rooms === null) {
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
