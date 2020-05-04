import React from 'react'
import { IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const CustomIconButton = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.ternary.main,
    '&:hover': {
      backgroundColor: theme.palette.ternary.dark
    },
    color: theme.palette.ternary.contrastText,
    '&$disabled': {
      color: theme.palette.ternary.main,
      backgroundColor: 'transparent'
    }
  },
  disabled: {}
}))(IconButton)

const IconButtonTernary = props => {
  return <CustomIconButton {...props}>{props.children}</CustomIconButton>
}

export default IconButtonTernary
