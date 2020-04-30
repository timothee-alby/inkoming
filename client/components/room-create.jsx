import React from 'react'
import Router from 'next/router'
import { Button } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox'
import RoomCreateDialog from '~/components/room-create-dialog'
import { useAuth } from '~/components/auth'
import milou from '~/lib/milou'
import RequestError from '~/components/request-error'

const RoomCreate = ({ buttonVariant }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [error, setError] = React.useState(null)
  const { userId, userJwt, userName } = useAuth()

  const createRoom = async roomName => {
    try {
      const room = await milou({
        method: 'POST',
        url: `${process.env.API_URL}/rooms`,
        jwt: userJwt,
        body: {
          user_id: userId,
          name: roomName
        }
      })
      await milou({
        method: 'POST',
        url: `${process.env.API_URL}/players`,
        jwt: userJwt,
        body: {
          user_id: userId,
          room_id: room.id,
          nickname: userName
        }
      })
      Router.push(`/rooms/${room.id}`)
    } catch (error) {
      setError(error)
    }
  }

  let dialog
  if (error) {
    dialog = <RequestError setError={setError} />
  } else {
    dialog = (
      <RoomCreateDialog
        createRoom={createRoom}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    )
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
      {dialog}
    </>
  )
}

export default RoomCreate
