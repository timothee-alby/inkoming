import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import SpaIcon from '@material-ui/icons/Spa'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

const useStyles = makeStyles(theme => ({
  iconUnknonw: {
    color: theme.palette.card.black
  },
  iconRed: {
    color: theme.palette.card.red
  },
  iconBlack: {
    color: theme.palette.card.black
  }
}))

const PlayingCard = ({ colour, style }) => {
  const classes = useStyles()

  if (!colour) {
    return <HelpOutlineIcon className={classes.iconUnknonw} style={style} />
  }

  return (
    <SpaIcon
      className={colour === 'red' ? classes.iconRed : classes.iconBlack}
    />
  )
}

export default PlayingCard
