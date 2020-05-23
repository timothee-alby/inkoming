import React from 'react'
import Router from 'next/router'
import { Button } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox'
import RoomCreateDialog from '~/components/rooms/create-dialog'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'
import RequestError from '~/components/request-error'
import { useTranslation } from 'react-i18next'

const RoomCreate = ({ buttonVariant, size }) => {
  const { t } = useTranslation()
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
        size={size}
        type="submit"
        color="secondary"
        startIcon={<AddBoxIcon />}
        onClick={() => setIsDialogOpen(true)}
      >
        {t('new room')}
      </Button>
      {dialog}
    </>
  )
}

export default RoomCreate
