import React from 'react'
import milou from '../../lib/milou'
import AppContentWrapper from '../_content'
import HeaderWrapper from '../../components/header'
import { useRouter } from 'next/router'
import { useAuth } from '../../components/auth'
import ContentLoading from '../../components/content-loading'
import RequestError from '../../components/request-error'
import RoomJoinDialog from '../../components/room-join-dialog'
import RoomPlayersList from '../../components/room-players-list'

const Room = () => {
  let room = { id: useRouter().query.id }
  const { data: rooms, error } = milou({
    url: `${process.env.API_URL}/rooms?id=eq.${room.id}&select=id,name,players(id,user_id,nickname)`,
    jwt: useAuth().userJwt
  })

  const WrappedHeader = HeaderWrapper()

  let WrappedContent
  if (error) {
    WrappedContent = AppContentWrapper(props => <RequestError />)
  } else if (!rooms) {
    WrappedContent = AppContentWrapper(props => <ContentLoading />)
  } else if (rooms.length === 0) {
    WrappedContent = AppContentWrapper(props => <RoomJoinDialog room={room} />)
  } else {
    room = rooms[0]
    WrappedContent = AppContentWrapper(props => <RoomPlayersList room={room} />)
  }

  return (
    <>
      <WrappedHeader title={room && room.name} />
      <WrappedContent />
    </>
  )
}

export default Room
