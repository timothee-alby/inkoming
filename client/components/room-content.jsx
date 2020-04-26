import React from 'react'
import RoomPlayersList from './room-players-list'
import RoomNotification from './room-notification'

const RoomContent = ({ room, socketPayload }) => {
  return (
    <>
      <RoomPlayersList room={room} />
      <RoomNotification socketPayload={socketPayload} />
    </>
  )
}

export default RoomContent
