import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  LinearProgress
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import RoomPlayerAvatar from '~/components/room/player/room-player-avatar'
import RoomPlayerTurns from '~/components/room/player/room-player-turns'
import PlayingBet from '~/components/room/playing-bet'

const useStyles = makeStyles(theme => ({
  content: {
    textAlign: 'center'
  },
  action: {
    marginRight: 0,
    marginTop: 0
  }
}))

const RoomPlayer = ({ player, roomState, mePlayer, setError }) => {
  const classes = useStyles()
  const [isNext, setIsNext] = React.useState(false)
  const [playerTurns, setPlayerTurns] = React.useState([])

  React.useEffect(() => {
    setIsNext(
      player.id === roomState.next_player_id ||
        player.id === roomState.challenger_player_id
    )
    const allTurns = roomState.all_turns
    if (allTurns) {
      setPlayerTurns(allTurns.filter(turn => turn.player_id === player.id))
    } else {
      setPlayerTurns([])
    }
  }, [player, roomState])

  return (
    <Card>
      <CardHeader
        title={player.nickname}
        variant="rounded"
        avatar={<RoomPlayerAvatar player={player} />}
        subheader={`${player.total_cards} cards`}
        action={<PlayingBet turns={playerTurns} />}
        classes={{ action: classes.action }}
      ></CardHeader>
      <CardContent className={classes.content}>
        <RoomPlayerTurns
          roomState={roomState}
          mePlayer={mePlayer}
          turns={playerTurns}
          setError={setError}
        />
      </CardContent>
      {isNext && <LinearProgress />}
    </Card>
  )
}

export default RoomPlayer
