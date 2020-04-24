import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))

const AppContentWrapper = WrappedComponent => props => {
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      {WrappedComponent && <WrappedComponent {...props} />}
    </Box>
  )
}

export default AppContentWrapper
