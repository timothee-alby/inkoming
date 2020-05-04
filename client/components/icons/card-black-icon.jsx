import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import BugReportIcon from '@material-ui/icons/BugReport'

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.card.black
  }
}))

const CardBlackIcon = ({ colour, className }) => {
  const classes = useStyles()

  return <BugReportIcon className={clsx(classes.icon, className)} />
}

export default CardBlackIcon
