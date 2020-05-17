import React from 'react'
import milou from '~/lib/milou'
import SocketHelper from '~/lib/socket-helper'
import { useAuth } from '~/components/auth/auth-context'
import RoomPlayersList from '~/components/room/players-list'
import RoomActions from '~/components/room/actions'
import RoomNotification from '~/components/room/notification'

const fetchData = async (
  userJwt,
  room,
  playerId,
  setRoomState,
  setMyTurns,
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
      url: `${process.env.API_URL}/turns?player_id=eq.${playerId}`,
      jwt: userJwt
    })
    setMyTurns(turns)
  } catch (error) {
    setError(error)
  }
}

const RoomContent = ({ room, player, roomState, setRoomState, setError }) => {
  const { userJwt } = useAuth()
  const [playerJwt, setPlayerJwt] = React.useState()
  const [socketIsConnected, setSocketIsConnected] = React.useState()
  const [myTurns, setMyTurns] = React.useState([])
  const [notification, setNotification] = React.useState()

  const playerId = player.id
  const mePlayerIsNext = roomState && playerId === roomState.next_player_id

  React.useEffect(() => {
    if (!playerId) return

    milou({
      method: 'POST',
      url: `${process.env.API_URL}/rpc/connect_player`,
      jwt: userJwt,
      body: {
        player_id: playerId
      }
    })
      .then(json => setPlayerJwt(json.jwt))
      .catch(setError)
  }, [userJwt, playerId, setError])

  React.useEffect(() => {
    if (!playerJwt) return

    const socketHelper = new SocketHelper(
      playerJwt,
      setSocketIsConnected,
      setNotification,
      setRoomState
    )
    socketHelper.createSocket()
  }, [playerJwt, setSocketIsConnected, setNotification, setRoomState])

  React.useEffect(() => {
    // don't fetch the room state until the socket is connected to make sure
    // we're up-to-date
    if (!socketIsConnected) return

    fetchData(userJwt, room, playerId, setRoomState, setMyTurns, setError)
  }, [
    socketIsConnected,
    userJwt,
    room,
    playerId,
    setRoomState,
    setMyTurns,
    setError
  ])

  console.log('roomState', roomState)
  return (
    <>
      {roomState && (
        <RoomPlayersList
          roomState={roomState}
          mePlayer={player}
          myTurns={myTurns}
          setError={setError}
        />
      )}
      {roomState && (
        <RoomActions
          roomState={roomState}
          player={player}
          playerTurns={myTurns}
          setPlayerTurns={setMyTurns}
          playerIsNext={mePlayerIsNext}
          setError={setError}
        />
      )}
      <RoomNotification notification={notification} />
    </>
  )
}

export default RoomContent
