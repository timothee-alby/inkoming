import React from 'react'
import { IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { green, purple } from '@material-ui/core/colors'

const ColorButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700]
    }
  }
}))(IconButton)

const PlayingBet = props => {
  // const classes = useStyles()
  return <ColorButton {...props}>{props.children}</ColorButton>
}

export default PlayingBet
