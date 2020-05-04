import React from 'react'
import { IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const CustomIconButton = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    },
    color: theme.palette.primary.contrastText,
    '&$disabled': {
      backgroundColor: theme.palette.ternary.main,
      color: theme.palette.ternary.contrastText
    }
  },
  disabled: {}
}))(IconButton)

const IconButtonCard = props => {
  return <CustomIconButton {...props}>{props.children}</CustomIconButton>
}

export default IconButtonCard
