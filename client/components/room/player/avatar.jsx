import React from 'react'
import clsx from 'clsx'
import { Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import OnePointAboveIcon from '~/components/icons/one-point-above-icon'
import OnePointBelowIcon from '~/components/icons/one-point-below-icon'
import IdentityColours from '~/lib/identity-colours'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  },
  avatar: {
    zIndex: 5
  },
  icon: {
    position: 'absolute'
  },
  aboveIcon: {
    zIndex: 10,
    top: '-22px',
    width: theme.spacing(9),
    height: theme.spacing(9),
    left: theme.spacing(2) * -1
  },
  belowIcon: {
    top: '8px',
    width: theme.spacing(11),
    height: theme.spacing(11),
    left: theme.spacing(3) * -1
  }
}))

const RoomPlayerAvatar = ({ playerPoints, playerNickname, colourClass }) => {
  const classes = useStyles()
  const identityColoursClasses = IdentityColours.useStyles()

  return (
    <div className={classes.root}>
      {playerPoints > 0 && (
        <>
          <OnePointAboveIcon
            className={clsx(classes.icon, classes.aboveIcon)}
          />
          <OnePointBelowIcon
            className={clsx(classes.icon, classes.belowIcon)}
          />
        </>
      )}
      <Avatar
        aria-label={playerNickname}
        variant="rounded"
        className={clsx(
          classes.avatar,
          identityColoursClasses[colourClass],
          'identity-colour-reverse'
        )}
      >
        {playerNickname[0].toUpperCase()}
        {playerNickname[1].toLowerCase()}
      </Avatar>
    </div>
  )
}

export default RoomPlayerAvatar
