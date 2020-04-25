import React from 'react'
import milou from '../../lib/milou'
import AppContentWrapper from '../_content'
import HeaderWrapper from '../../components/header'
import { useRouter } from 'next/router'
import { useAuth } from '../../components/auth'
import ContentLoading from '../../components/content-loading'
import RequestError from '../../components/request-error'

const Room = () => {
  const { data: room, error } = milou({
    url: `${process.env.API_URL}/rooms?id=eq.${useRouter().query.id}`,
    jwt: useAuth().userJwt,
    singleObject: true
  })

  const WrappedHeader = HeaderWrapper()

  let WrappedContent
  if (error) {
    WrappedContent = AppContentWrapper(props => <RequestError />)
  } else if (!room) {
    WrappedContent = AppContentWrapper(props => <ContentLoading />)
  } else {
    WrappedContent = AppContentWrapper(props => <h1>{room.name}</h1>)
  }

  return (
    <>
      <WrappedHeader title={room && room.name} />
      <WrappedContent />
    </>
  )
}

export default Room
