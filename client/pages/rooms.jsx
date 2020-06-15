import OError from '@overleaf/o-error'
import React from 'react'
import { Container } from '@material-ui/core'
import milou from '~/lib/milou'
import { useAuth } from '~/components/auth/auth-context'
import Header from '~/components/layout/header'
import Content from '~/components/layout/content'
import RoomsList from '~/components/rooms/list'
import RoomsListEmpty from '~/components/rooms/list-empty'
import RoomCreate from '~/components/rooms/create'
import RequestError from '~/components/request-error'
import ContentLoading from '~/components/layout/content-loading'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import BaseIcon from '~/components/icons/base-icon'

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(2)
  },
  baseIcon: {
    position: 'absolute',
    bottom: 0,
    right: theme.spacing(2),
    width: '90%',
    maxWidth: theme.spacing(30),
    height: 'auto'
  }
}))

const Rooms = () => {
  const { t } = useTranslation()
  const classes = useStyles()
  const { userJwt } = useAuth()
  const [rooms, setRooms] = React.useState(null)
  const [inFlight, setInFlight] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!userJwt) return

    milou({
      url: `${process.env.API_URL}/rooms?select=*,room_states(all_players)`,
      jwt: userJwt
    })
      .then(setRooms)
      .catch(error => {
        setError(
          OError.tag(error, 'cannot get rooms', {
            retryable: true
          })
        )
      })
      .finally(() => setInFlight(false))
  }, [userJwt])

  return (
    <>
      <Header>
        <RoomCreate buttonVariant="outlined" size="small" />
      </Header>
      <Content>
        <Container className={classes.container}>
          {inFlight && <ContentLoading />}
          {error && <RequestError error={error} />}
          {rooms && rooms.length === 0 && <RoomsListEmpty />}
          {rooms && rooms.length > 0 && <RoomsList rooms={rooms} />}
        </Container>
      </Content>
      <BaseIcon className={classes.baseIcon} />
    </>
  )
}

export default Rooms
