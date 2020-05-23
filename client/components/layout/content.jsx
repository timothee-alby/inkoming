import React from 'react'
import clsx from 'clsx'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
    paddingTop: theme.spacing(6)
  }
}))

const Content = props => {
  const classes = useStyles()
  return (
    <Container
      maxWidth="sm"
      {...props}
      classes={{ root: clsx(['full-height', classes.root]) }}
    >
      {props.children}
    </Container>
  )
}

export default Content
