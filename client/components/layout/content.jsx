import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))

const Content = props => {
  const classes = useStyles()
  return <Box className={classes.root}>{props.children}</Box>
}

export default Content
