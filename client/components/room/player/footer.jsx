import React from 'react'
import { CardActions } from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'right',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  },
  toggleButton: {
    border: 'none',
    margin: 0,
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
  showMyCards,
  setShowMyCards
}) => {
  const classes = useStyles()
  if (mePlayerId !== playerId) return null

  return (
    <CardActions className={classes.root}>
      <ToggleButton
        className={classes.toggleButton}
        value="showMyCards"
        selected={showMyCards}
        size="small"
        onChange={() => setShowMyCards(!showMyCards)}
      >
        {showMyCards ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </ToggleButton>
    </CardActions>
  )
}

export default RoomPlayerFooter
