import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import SpaIcon from '@material-ui/icons/Spa'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

const useStyles = makeStyles(theme => ({
  iconRed: {
    color: theme.palette.card.red
  },
  iconBlack: {
    color: theme.palette.card.black
  }
}))

const PlayingCard = ({ colour, className }) => {
  const classes = useStyles()

  if (!colour) {
    return <HelpOutlineIcon className={clsx(classes.iconUnknonw, className)} />
  }

  return (
    <SpaIcon
      className={colour === 'red' ? classes.iconRed : classes.iconBlack}
    />
  )
}

export default PlayingCard
