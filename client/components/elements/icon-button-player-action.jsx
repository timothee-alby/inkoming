import React from 'react'
import { IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const CustomIconButton = withStyles(theme => ({
  root: {
    color: theme.palette.common.white,
    '&$disabled': {
      color: theme.palette.common.white
    }
  },
  disabled: {}
}))(IconButton)

const IconButtonTernary = props => {
  return <CustomIconButton {...props}>{props.children}</CustomIconButton>
}

export default IconButtonTernary
