import React from 'react'
import AppContentWrapper from '../_content'
import HeaderWrapper from '../../components/header'
import { useRouter } from 'next/router'

const Room = () => {
  const router = useRouter()
  const { id: roomId } = router.query

  const WrappedHeader = HeaderWrapper()

  const WrappedContent = AppContentWrapper()

  return (
    <>
      <WrappedHeader title={roomId} />
      <WrappedContent />
    </>
  )
}

export default Room
