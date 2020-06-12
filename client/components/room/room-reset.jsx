import OError from '@overleaf/o-error'
import React from 'react'
import RoomResetDialog from '~/components/room/room-reset-dialog'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'

const RoomReset = ({
  buttonVariant,
  gameWinnerPlayerId,
  allPlayers,
  mePlayer,
  setError
}) => {
  const { userJwt } = useAuth()

  const resetRoom = async () => {
    try {
      await milou({
        method: 'POST',
        url: `${process.env.API_URL}/rpc/reset_room`,
        jwt: userJwt,
        body: {
          player_id: mePlayer.id
        }
      })
    } catch (error) {
      setError(
        OError.tag(error, 'cannot reset room', {
          retryable: true
        })
      )
    }
  }

  return (
    <RoomResetDialog
      resetRoom={resetRoom}
      gameWinnerPlayerId={gameWinnerPlayerId}
      allPlayers={allPlayers}
    />
  )
}

export default RoomReset
