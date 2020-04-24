import React from 'react'
import Router from 'next/router'
import { Button } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox'
import RoomCreateDialog from './room-create-dialog'
import { useAuth } from './auth'
import { getPostHeader } from '../lib/fetch'

const RoomCreate = ({ buttonVariant }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const { userId, userJwt } = useAuth()

  const createRoom = roomName => {
    fetch(`${process.env.API_URL}/rooms`, {
      method: 'POST',
      headers: getPostHeader(userJwt),
      body: JSON.stringify({
        user_id: userId,
        name: roomName
      })
    })
      .then(res => res.json())
      .then(res => {
        Router.push(`/rooms/${res.id}`)
      })
  }

  return (
    <>
      <Button
        variant={buttonVariant}
        type="submit"
        color="secondary"
        startIcon={<AddBoxIcon />}
        onClick={() => setIsDialogOpen(true)}
      >
        New Room
      </Button>
      <RoomCreateDialog
        createRoom={createRoom}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </>
  )
}

export default RoomCreate
