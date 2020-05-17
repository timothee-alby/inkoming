import React from 'react'
import clsx from 'clsx'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  LinearProgress
} from '@material-ui/core'
import ToggleButton from '@material-ui/lab/ToggleButton'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { makeStyles } from '@material-ui/core/styles'
import IdentityColours from '~/lib/identity-colours'
import RoomPlayerAvatar from '~/components/room/player/room-player-avatar'
import RoomPlayerTurnGhost from '~/components/room/player/room-player-turn-ghost'
import RoomPlayerTurns from '~/components/room/player/room-player-turns'
import RoomPlayerHeaderTitle from '~/components/room/player/header/room-player-header-title'
import RoomPlayerHeaderSubheader from '~/components/room/player/header/room-player-header-subheader'
import PlayingBet from '~/components/room/playing-bet'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2)
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
  headerAction: {
    width: '40px'
  },
  actions: {
    justifyContent: 'right',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  },
  actionsToggleButton: {
    border: 'none',
    margin: 0,
    padding: 0,
    height: theme.spacing(3),
    color: theme.palette.secondary.main,
    '&.Mui-selected': {
      color: theme.palette.secondary.dark,
      backgroundColor: 'transparent'
    }
  },
  progress: {
    marginTop: theme.spacing(0.5) * -1
  }
}))

const RoomPlayer = ({
  player,
  roomState,
  mePlayer,
  myTurns,
  challengerPlayer,
  setError
}) => {
  const classes = useStyles()
  const identityColoursClasses = IdentityColours.useStyles()
  const [isNext, setIsNext] = React.useState(false)
  const [playerTurns, setPlayerTurns] = React.useState([])
  const [colourClass, setColourClass] = React.useState()
  const [showMyCards, setShowMyCards] = React.useState(false)

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

  React.useEffect(() => {
    setColourClass(IdentityColours.getColourClass(player))
  }, [player])

  return (
    <Card raised={true} className={classes.root}>
      <CardHeader
        title={<RoomPlayerHeaderTitle player={player} />}
        avatar={<RoomPlayerAvatar player={player} />}
        subheader={<RoomPlayerHeaderSubheader player={player} />}
        action={<PlayingBet turns={playerTurns} />}
        className={clsx(classes.header, identityColoursClasses[colourClass])}
        classes={{
          action: classes.headerAction,
          content: classes.headerContent
        }}
        disableTypography={true}
      ></CardHeader>
      <CardContent
        className={clsx(
          classes.content,
          identityColoursClasses[colourClass],
          'identity-colour-light'
        )}
      >
        {!playerTurns.length && <RoomPlayerTurnGhost />}
        <RoomPlayerTurns
          roomState={roomState}
          mePlayer={mePlayer}
          turns={showMyCards ? myTurns : playerTurns}
          challengerPlayer={challengerPlayer}
          setError={setError}
        />
      </CardContent>
      {mePlayer.id === player.id && (
        <CardActions className={classes.actions}>
          <ToggleButton
            className={classes.actionsToggleButton}
            value="showMyCards"
            selected={showMyCards}
            size="small"
            onChange={() => setShowMyCards(!showMyCards)}
          >
            {showMyCards ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </ToggleButton>
        </CardActions>
      )}
      {isNext && !roomState.outcome && (
        <LinearProgress className={classes.progress} />
      )}
    </Card>
  )
}

export default RoomPlayer
