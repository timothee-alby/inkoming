import clsx from 'clsx'
import React from 'react'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  toggleButton: {
    position: 'absolute',
    bottom: theme.spacing(0.5),
    left: theme.spacing(1),
    border: 'none',
    padding: 0,
    height: theme.spacing(3),
    color: theme.palette.secondary.main,
    cursor: 'pointer'
  },
  toggleButtonSelected: {
    color: theme.palette.secondary.dark
  },
  hidden: {
    display: 'none'
  }
}))

const RoomPlayerFooter = ({
  playerId,
  mePlayerId,
  hasTurns,
  showMyCards,
  setShowMyCards,
  canShowMyCards
}) => {
  const classes = useStyles()
  if (mePlayerId !== playerId) return null
  if (!hasTurns) return null
  if (!canShowMyCards) return null

  return (
    <Box
      className={clsx({
        [classes.toggleButton]: true,
        [classes.toggleButtonSelected]: showMyCards
      })}
      onTouchStart={() => setShowMyCards(true)}
      onTouchEnd={() => setShowMyCards(false)}
    >
      <VisibilityIcon className={clsx({ [classes.hidden]: !showMyCards })} />
      <VisibilityOffIcon className={clsx({ [classes.hidden]: showMyCards })} />
    </Box>
  )
}

export default RoomPlayerFooter
