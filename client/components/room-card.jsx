import React from 'react'
import Link from 'next/link'
import {
  Card,
  CardActionArea,
  CardContent,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'

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
    display: 'flex'
  },
  title: {
    flexGrow: '1'
  }
}))

const RoomCard = ({ room }) => {
  const classes = useStyles()
  return (
    <Card className={classes.root + ' pattern-diagonal-stripes-md'}>
      <Link href={'/rooms/' + room.id}>
        <CardActionArea>
          <CardContent className={classes.content}>
            <Typography variant="h5" component="h2" className={classes.title}>
              {room.name}
            </Typography>
            <NavigateNextIcon fontSize="large" />
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

export default RoomCard
