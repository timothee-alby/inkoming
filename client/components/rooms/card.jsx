import React from 'react'
import Link from 'next/link'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.action.main,
    color: theme.palette.background.action.gradient,
    '&:hover': {
      backgroundColor: theme.palette.background.action.hover.main,
      color: theme.palette.background.action.hover.gradient
    }
  },
  content: {
    color: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center'
  },
  titles: {
    flexGrow: '1'
  },
  subtitle: {
    color: theme.palette.common.white,
    fontStyle: 'italic'
  }
}))

const RoomCard = ({ room }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const players = room.room_states[0].all_players
  const otherPlayersCount = players.length - 1
  return (
    <Card className={classes.root + ' pattern-diagonal-stripes-md'}>
      <Link href={`/rooms/${room.id}`}>
        <CardActionArea>
          <CardContent className={classes.content}>
            <Box className={classes.titles}>
              <Typography variant="h5" className={classes.title}>
                {room.name}
              </Typography>
              <Typography className={classes.subtitle} color="textSecondary">
                {otherPlayersCount === 0 && t('with 0 players')}
                {otherPlayersCount > 0 &&
                  t('with N players', { count: otherPlayersCount })}
              </Typography>
            </Box>
            <NavigateNextIcon fontSize="large" />
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

export default RoomCard
