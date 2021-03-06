import OError from '@overleaf/o-error'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { IconButton } from '@material-ui/core'
import milou from '~/lib/milou'
import Content from '~/components/layout/content'
import Header from '~/components/layout/header'
import { useAuth } from '~/components/auth/auth-context'
import ContentLoading from '~/components/layout/content-loading'
import RequestError from '~/components/request-error'
import RoomJoinDialog from '~/components/room/join-dialog'
import RoomContent from '~/components/room/content'
import RoundReset from '~/components/room/round-reset'
import RoomReset from '~/components/room/room-reset'
import { useTranslation } from 'react-i18next'
import LogoSquareIcon from '~/components/icons/logo-square-icon'

const NavigateBackLogo = ({ t }) => (
  <Link href={'/rooms'}>
    <IconButton aria-label={t('action.back')} size="small">
      <LogoSquareIcon fontSize="large" />
    </IconButton>
  </Link>
)

const Room = () => {
  const { t } = useTranslation()
  const { id: roomId } = useRouter().query
  const { userJwt } = useAuth()
  const [inFlight, setInFlight] = React.useState(true)
  const [error, setError] = React.useState()
  const [room, setRoom] = React.useState()
  const [roomState, setRoomState] = React.useState()
  const [player, setPlayer] = React.useState()
  const [hasJoined, setHasJoined] = React.useState(false)
  const [lastChallengerAt, setLastChallengerAt] = React.useState()

  // fetch the room and its player. There will be only 0 or 1 player as the user
  // can only see its player
  React.useEffect(() => {
    if (!roomId) return

    milou({
      url: `${process.env.API_URL}/rooms?id=eq.${roomId}&select=*,players(*)`,
      jwt: userJwt
    })
      .then(rooms => setRoom(rooms[0]))
      .catch(error => {
        setError(
          OError.tag(error, 'cannot get room', {
            retryable: true
          })
        )
      })
      .finally(() => setInFlight(false))
  }, [userJwt, roomId, hasJoined, lastChallengerAt])

  // extract player from room
  // room)
  React.useEffect(() => {
    if (!room) return

    setPlayer(room.players[0])
  }, [room])

  React.useEffect(() => {
    if (!roomState) return

    const lastChallengers = roomState.all_players.filter(
      player => player.last_challenger_at
    )
    if (!lastChallengers.length) return

    setLastChallengerAt(
      Math.max(
        ...lastChallengers.map(player => new Date(player.last_challenger_at))
      )
    )
  }, [roomState])

  return (
    <>
      <Header logo={<NavigateBackLogo t={t} />} title={room && room.name}>
        {roomState && roomState.outcome && (
          <RoundReset
            buttonVariant="outlined"
            size="small"
            roomState={roomState}
            player={player}
            setError={setError}
          />
        )}
        {roomState && roomState.game_winner_player_id && (
          <RoomReset
            buttonVariant="outlined"
            size="small"
            gameWinnerPlayerId={roomState.game_winner_player_id}
            allPlayers={roomState.all_players}
            mePlayer={player}
            setError={setError}
          />
        )}
      </Header>
      <Content>
        {inFlight && <ContentLoading />}
        {error && <RequestError error={error} setError={setError} />}
        {!room && !inFlight && !error && (
          <RoomJoinDialog roomId={roomId} setHasJoined={setHasJoined} />
        )}
        {room && player && (
          <RoomContent
            room={room}
            player={player}
            roomState={roomState}
            setRoomState={setRoomState}
            setError={setError}
          />
        )}
      </Content>
    </>
  )
}

export default Room
