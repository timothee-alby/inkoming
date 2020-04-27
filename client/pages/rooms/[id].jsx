import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { IconButton } from '@material-ui/core'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import milou from '../../lib/milou'
import Content from '../../components/content'
import Header from '../../components/header'
import { useAuth } from '../../components/auth'
import ContentLoading from '../../components/content-loading'
import RequestError from '../../components/request-error'
import RoomJoinDialog from '../../components/room-join-dialog'
import RoomContent from '../../components/room-content'

const NavigateBackLogo = () => (
  <Link href={'/rooms'}>
    <IconButton aria-label="delete">
      <NavigateBeforeIcon fontSize="large" />
    </IconButton>
  </Link>
)

const Room = () => {
  const { id: roomId } = useRouter().query
  const { userJwt } = useAuth()
  const [inFlight, setInFlight] = React.useState(true)
  const [error, setError] = React.useState()
  const [room, setRoom] = React.useState()
  const [player, setPlayer] = React.useState()
  const [hasJoined, setHasJoined] = React.useState(false)

  // fetch the room and its player. There will be only 0 or 1 player as the user
  // can only see its player
  React.useEffect(() => {
    if (!roomId) return

    milou({
      url: `${process.env.API_URL}/rooms?id=eq.${roomId}&select=*,players(*)`,
      jwt: userJwt
    })
      .then(rooms => setRoom(rooms[0]))
      .catch(setError)
      .finally(() => setInFlight(false))
  }, [userJwt, roomId, hasJoined])

  // extract player from room
  // room)
  React.useEffect(() => {
    if (!room) return

    setPlayer(room.players[0])
  }, [room])

  return (
    <>
      <Header logo={<NavigateBackLogo />} title={room && room.name} />
      <Content>
        {inFlight && <ContentLoading />}
        {error && <RequestError setError={setError} />}
        {!room && !inFlight && !error && (
          <RoomJoinDialog roomId={roomId} setHasJoined={setHasJoined} />
        )}
        {room && player && (
          <RoomContent room={room} player={player} setError={setError} />
        )}
      </Content>
    </>
  )
}

export default Room
