import React from 'react'
import milou from '~/lib/milou'
import SocketHelper from '~/lib/socket-helper'
import { useAuth } from '~/components/auth/auth-context'
import RoomPlayersList from '~/components/room/room-players-list'
import RoomActions from '~/components/room/room-actions'
import RoomNotification from '~/components/room/room-notification'

const fetchData = async (
  userJwt,
  room,
  player,
  setRoomState,
  setPlayerTurns,
  setError
) => {
  try {
    const rooms = await milou({
      url: `${process.env.API_URL}/rooms?id=eq.${room.id}&select=*,room_states(*)`,
      jwt: userJwt
    })
    const [{ room_states: roomStates }] = rooms
    const [roomState] = roomStates
    setRoomState(roomState)

    const turns = await milou({
      url: `${process.env.API_URL}/turns?player_id=eq.${player.id}`,
      jwt: userJwt
    })
    setPlayerTurns(turns)
  } catch (error) {
    setError(error)
  }
}

const RoomContent = ({ room, player, setError }) => {
  const { userJwt } = useAuth()
  const [playerJwt, setPlayerJwt] = React.useState()
  const [socketIsConnected, setSocketIsConnected] = React.useState()
  const [roomState, setRoomState] = React.useState()
  const [playerTurns, setPlayerTurns] = React.useState([])
  const [playerIsNext, setPlayerIsNext] = React.useState(false)
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

    fetchData(userJwt, room, player, setRoomState, setPlayerTurns, setError)
  }, [userJwt, room, socketIsConnected, setError])

  React.useEffect(() => {
    if (!roomState) return

    setPlayerIsNext(player.id === roomState.next_player_id)
  }, [roomState, player])

  console.log('roomState', roomState)
  return (
    <>
      {roomState && (
        <RoomPlayersList
          roomState={roomState}
          mePlayer={player}
          setError={setError}
        />
      )}
      {roomState && (
        <RoomActions
          roomState={roomState}
          player={player}
          playerTurns={playerTurns}
          setPlayerTurns={setPlayerTurns}
          playerIsNext={playerIsNext}
          setError={setError}
        />
      )}
      <RoomNotification notification={notification} />
    </>
  )
}

export default RoomContent
