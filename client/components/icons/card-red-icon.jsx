import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.card.red
  }
}))

const CardRedIcon = ({ colour, className }) => {
  const classes = useStyles()

  return <LocalFloristIcon className={clsx(classes.icon, className)} />
}

export default CardRedIcon
