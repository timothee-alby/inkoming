import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AlienHappyIcon from '~/components/icons/alien-happy-icon'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: 'auto',
    bottom: '60px',
    zIndex: 10,
    animation: 'alien-happy 1s linear infinite'
  }
}))

const AlienHappyAnimation = props => {
  const classes = useStyles()
  return <AlienHappyIcon {...props} className={classes.root} />
}

export default AlienHappyAnimation
