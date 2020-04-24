import React from 'react'
import AppContentWrapper from './_content'
import HeaderWrapper from '../components/header'
import RoomList from '../components/rooms-list'
import RoomCreate from '../components/room-create'

const Rooms = () => {
  const WrappedHeader = HeaderWrapper(props => (
    <RoomCreate buttonVariant="outlined" />
  ))

  const WrappedContent = AppContentWrapper(props => <RoomList />)

  return (
    <>
      <WrappedHeader title="Rooms" />
      <WrappedContent />
    </>
  )
}

export default Rooms
