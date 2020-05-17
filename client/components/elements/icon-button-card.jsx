import React from 'react'
import { IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const CustomIconButton = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(1.5),
    margin: theme.spacing(1),
    marginTop: 0,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
    },
    '&$disabled': {
      padding: theme.spacing(0.5),
      backgroundColor: theme.palette.common.white,
      '&.can-be-revealed': {
        backgroundColor: theme.palette.secondary.dark
      }
    }
  },
  disabled: {}
}))(IconButton)

const IconButtonCard = props => {
  return <CustomIconButton {...props}>{props.children}</CustomIconButton>
}

export default IconButtonCard
