import React from 'react'
import clsx from 'clsx'
import { CardContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import IdentityColours from '~/lib/identity-colours'
import RoomPlayerTurnGhost from '~/components/room/player/turn-ghost'
import RoomPlayerTurns from '~/components/room/player/turns'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  }
}))

const RoomPlayerContent = ({
  outcome,
  playerTurns,
  myTurns,
  mePlayer,
  showMyCards,
  challengerPlayer,
  colourClass,
  setError
}) => {
  const classes = useStyles()
  const identityColoursClasses = IdentityColours.useStyles()

  return (
    <CardContent
      className={clsx(
        classes.root,
        identityColoursClasses[colourClass],
        'identity-colour-light'
      )}
    >
      {!playerTurns.length && <RoomPlayerTurnGhost />}
      <RoomPlayerTurns
        outcome={outcome}
        mePlayer={mePlayer}
        turns={showMyCards ? myTurns : playerTurns}
        challengerPlayer={challengerPlayer}
        setError={setError}
      />
    </CardContent>
  )
}

export default RoomPlayerContent
