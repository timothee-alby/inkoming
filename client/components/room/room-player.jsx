import React from 'react'
import { Card } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import RoomPlayerHeader from '~/components/room/player/header'
import RoomPlayerContent from '~/components/room/player/content'
import RoomPlayerFooter from '~/components/room/player/footer'
import RoomPlayerProgress from '~/components/room/player/progress'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2)
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
  playerTurns,
  setError
}) => {
  const classes = useStyles()
  const [showMyCards, setShowMyCards] = React.useState(false)

  return (
    <Card raised={true} className={classes.root}>
      <RoomPlayerHeader
        playerNickname={player.nickname}
        playerPoints={player.points}
        playerTotalCards={player.totalCards}
        playerCardedCards={player.cardedCards}
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
        showMyCards={showMyCards}
        setShowMyCards={setShowMyCards}
      />
      <RoomPlayerProgress outcome={outcome} isNext={isNext} />
    </Card>
  )
}

export default RoomPlayer
