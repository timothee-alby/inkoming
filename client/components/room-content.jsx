import React from 'react'
import milou from '~/lib/milou'
import SocketHelper from '~/lib/socket-helper'
import { useAuth } from '~/components/auth'
import RoomPlayersList from '~/components/room-players-list'
import RoomNotification from '~/components/room-notification'

const RoomContent = ({ room, player, setError }) => {
  const { userJwt } = useAuth()
  const [playerJwt, setPlayerJwt] = React.useState()
  const [socketIsConnected, setSocketIsConnected] = React.useState()
  const [roomState, setRoomState] = React.useState()
  const [notification, setNotification] = React.useState()

  React.useEffect(() => {
    milou({
      method: 'POST',
      url: `${process.env.API_URL}/rpc/connect_player`,
      jwt: userJwt,
      body: {
        player_id: player.id
      }
    })
      .then(json => setPlayerJwt(json.jwt))
      .catch(setError)
  }, [userJwt, player, setError])

  React.useEffect(() => {
    if (!playerJwt) return

    const socketHelper = new SocketHelper(
      playerJwt,
      setSocketIsConnected,
      setNotification,
      setRoomState
    )
    socketHelper.createSocket()
  }, [playerJwt])

  React.useEffect(() => {
    // don't fetch the room state until the socket is connected to make sure
    // we're up-to-date
    if (!socketIsConnected) return

    milou({
      url: `${process.env.API_URL}/room_states?room_id=eq.${room.id}&select=*,player_states(*)`,
      jwt: userJwt
    })
      .then(roomStates => setRoomState(roomStates[0]))
      .catch(setError)
  }, [userJwt, room, socketIsConnected, setError])

  return (
    <>
      {roomState && <RoomPlayersList players={roomState.player_states} />}
      <RoomNotification notification={notification} />
    </>
  )
}

export default RoomContent
