import React from 'react'
import { Box, Typography } from '@material-ui/core'
import RoomCreate from '~/components/room-create'

const RoomsList = () => {
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

export default RoomsList
