import React from 'react'
import milou from '../../lib/milou'
import AppContentWrapper from '../_content'
import HeaderWrapper from '../../components/header'
import { useRouter } from 'next/router'
import { useAuth } from '../../components/auth'
import ContentLoading from '../../components/content-loading'
import RequestError from '../../components/request-error'
import RoomJoinDialog from '../../components/room-join-dialog'
import RoomContent from '../../components/room-content'

function createWebSocket(jwt) {}

const Room = () => {
  let room = { id: useRouter().query.id }
  const [error, setError] = React.useState(null)
  const [rooms, setRooms] = React.useState(null)
  const [playerJwt, setPlayerJwt] = React.useState(null)
  const [socket, setSocket] = React.useState(null)
  const [socketPayload, setSocketPayload] = React.useState(null)
  const { userJwt } = useAuth()

  if (room.id && !rooms && !error) {
    milou({
      url: `${process.env.API_URL}/rooms?id=eq.${room.id}&select=id,name,players(id,user_id,nickname)`,
      jwt: userJwt
    })
      .then(setRooms)
      .catch(setError)
  }

  const WrappedHeader = HeaderWrapper()

  if (error) {
    const WrappedContent = AppContentWrapper(props => (
      <RequestError setError={setError} />
    ))
    return renderPage(WrappedHeader, WrappedContent)
  }

  if (!rooms) {
    const WrappedContent = AppContentWrapper(props => <ContentLoading />)
    return renderPage(WrappedHeader, WrappedContent)
  }

  if (rooms.length === 0) {
    const WrappedContent = AppContentWrapper(props => (
      <RoomJoinDialog room={room} />
    ))
    return renderPage(WrappedHeader, WrappedContent)
  }

  room = rooms[0]
  if (!playerJwt) {
    milou({
      method: 'POST',
      url: `${process.env.API_URL}/rpc/connect_player`,
      jwt: userJwt,
      body: {
        player_id: room.players[0].id
      }
    })
      .then(res => setPlayerJwt(res.jwt))
      .catch(setError)

    const WrappedContent = AppContentWrapper(props => <ContentLoading />)
    return renderPage(WrappedHeader, WrappedContent, room)
  }

  if (!socket) {
    const pendingSocket = new WebSocket(
      `${process.env.WEBSOCKET_URL}/${playerJwt}`
    )
    pendingSocket.onopen = e => {
      pendingSocket.send(JSON.stringify({ notification: 'A player joined' }))
      setSocket(pendingSocket)
    }
    pendingSocket.onmessage = e => {
      const data = JSON.parse(e.data)
      const payload = JSON.parse(data.payload)
      setSocketPayload(payload)
    }

    const WrappedContent = AppContentWrapper(props => <ContentLoading />)
    return renderPage(WrappedHeader, WrappedContent, room)
  }

  // at this point, the player is successfully connected to the room
  const WrappedContent = AppContentWrapper(props => (
    <RoomContent room={room} socketPayload={socketPayload} />
  ))
  return renderPage(WrappedHeader, WrappedContent, room)
}

const renderPage = (WrappedHeader, WrappedContent, room = null) => {
  return (
    <>
      <WrappedHeader title={room && room.name} />
      <WrappedContent />
    </>
  )
}

export default Room
