import React from 'react'
import clsx from 'clsx'
import { Card } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import RoomPlayerOutcome from '~/components/room/player/outcome'
import RoomPlayerAbove from '~/components/room/player/above'
import RoomPlayerHeader from '~/components/room/player/header'
import RoomPlayerContent from '~/components/room/player/content'
import RoomPlayerFooter from '~/components/room/player/footer'
import RoomPlayerProgress from '~/components/room/player/progress'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative', // needed to keep absolute-aligned elements in place
    margin: theme.spacing(1)
  },
  heartbeat: {
    animation: 'heartbeat 1.5s ease-in-out infinite both'
  },
  onePoint: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    backgroundColor: theme.palette.spaceship.redShade
  }
}))

const RoomPlayer = ({
  player,
  outcome,
  mePlayer,
  myTurns,
  challengerPlayer,
  colourClass,
  isNext,
  isChallenger,
  playerTurns,
  showMyCards,
  setShowMyCards,
  canShowMyCards,
  setError
}) => {
  const classes = useStyles()

  return (
    <Card
      raised={true}
      className={clsx({
        [classes.root]: true,
        [classes.onePoint]: player.points > 0,
        [classes.heartbeat]: isNext && !isChallenger && !outcome
      })}
    >
      <RoomPlayerOutcome isChallenger={isChallenger} outcome={outcome} />
      <RoomPlayerAbove isChallenger={isChallenger} />
      <RoomPlayerHeader
        playerNickname={player.nickname}
        playerPoints={player.points}
        playerTotalCards={player.total_cards}
        playerCardedCards={player.carded_cards}
        colourClass={colourClass}
        playerTurns={playerTurns}
      />
      <RoomPlayerContent
        outcome={outcome}
        playerTurns={playerTurns}
        myTurns={myTurns}
        mePlayer={mePlayer}
        showMyCards={showMyCards}
        challengerPlayer={challengerPlayer}
        colourClass={colourClass}
        setError={setError}
      />
      <RoomPlayerFooter
        playerId={player.id}
        mePlayerId={mePlayer.id}
        hasTurns={myTurns.length > 0}
        showMyCards={showMyCards}
        setShowMyCards={setShowMyCards}
        canShowMyCards={canShowMyCards}
      />
      <RoomPlayerProgress
        outcome={outcome}
        isNext={isNext}
        isChallenger={isChallenger}
      />
    </Card>
  )
}

export default RoomPlayer
