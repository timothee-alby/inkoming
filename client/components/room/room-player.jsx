import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  LinearProgress
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import RoomPlayerAvatar from '~/components/room/player/room-player-avatar'
import RoomPlayerTurnGhost from '~/components/room/player/room-player-turn-ghost'
import RoomPlayerTurns from '~/components/room/player/room-player-turns'
import RoomPlayerHeaderTitle from '~/components/room/player/header/room-player-header-title'
import RoomPlayerHeaderSubheader from '~/components/room/player/header/room-player-header-subheader'
import PlayingBet from '~/components/room/playing-bet'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(4)
  },
  header: {
    paddingBottom: theme.spacing(2)
  },
  headerContent: {
    lineHeight: 0
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  },
  action: {
    marginRight: 0,
    marginTop: 0,
    width: '40px'
  },
  progress: {
    marginTop: theme.spacing(0.5) * -1
  }
}))

const RoomPlayer = ({
  player,
  roomState,
  mePlayer,
  challengerPlayer,
  setError
}) => {
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
    <Card className={classes.root}>
      <CardHeader
        title={<RoomPlayerHeaderTitle player={player} />}
        avatar={<RoomPlayerAvatar player={player} />}
        subheader={<RoomPlayerHeaderSubheader player={player} />}
        action={<PlayingBet turns={playerTurns} />}
        className={classes.header}
        classes={{ action: classes.action, content: classes.headerContent }}
        disableTypography={true}
      ></CardHeader>
      <CardContent className={classes.content}>
        {!playerTurns.length && <RoomPlayerTurnGhost />}
        <RoomPlayerTurns
          roomState={roomState}
          mePlayer={mePlayer}
          turns={playerTurns}
          challengerPlayer={challengerPlayer}
          setError={setError}
        />
      </CardContent>
      {isNext && !roomState.outcome && (
        <LinearProgress className={classes.progress} />
      )}
    </Card>
  )
}

export default RoomPlayer
