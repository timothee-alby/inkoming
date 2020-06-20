import React from 'react'
import ToggleButton from '@material-ui/lab/ToggleButton'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  toggleButton: {
    position: 'absolute',
    bottom: theme.spacing(0.5),
    left: theme.spacing(1),
    border: 'none',
    padding: 0,
    height: theme.spacing(3),
    color: theme.palette.secondary.main,
    '&.Mui-selected': {
      color: theme.palette.secondary.dark,
      backgroundColor: 'transparent'
    }
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
    <ToggleButton
      className={classes.toggleButton}
      value="showMyCards"
      selected={showMyCards}
      size="small"
      onChange={() => setShowMyCards(!showMyCards)}
    >
      {showMyCards ? <VisibilityIcon /> : <VisibilityOffIcon />}
    </ToggleButton>
  )
}

export default RoomPlayerFooter
