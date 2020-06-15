import React from 'react'
import clsx from 'clsx'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from '~/components/auth/auth-context'
import LogoIcon from '~/components/icons/logo-icon'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.header.main,
    color: theme.palette.background.header.gradient
  },
  toolbar: {
    color: theme.palette.common.white
  },
  logoIcon: {
    width: '5.15em'
  },
  title: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  userName: {
    marginLeft: 'auto',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}))

const Header = props => {
  const classes = useStyles()
  const { userName } = useAuth()

  return (
    <AppBar
      position="fixed"
      className={clsx([[classes.root], 'pattern-cross-dots-sm'])}
    >
      <Toolbar className={classes.toolbar} variant="dense">
        {props.logo ? props.logo : <LogoIcon className={classes.logoIcon} />}
        <Typography variant="h6" className={classes.title}>
          {props.title}
        </Typography>
        {props.children}
        <Typography variant="h6" className={classes.userName}>
          {userName}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header
