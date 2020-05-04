import React from 'react'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))

const Content = props => {
  const classes = useStyles()
  return (
    <Container maxWidth="sm" className={classes.root}>
      {props.children}
    </Container>
  )
}

export default Content
