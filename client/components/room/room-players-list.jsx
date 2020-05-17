import React from 'react'
import { Box, Typography } from '@material-ui/core'
import RoomPlayer from '~/components/room/room-player'
import RoomPLayerGhost from '~/components/room/room-player-ghost'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    height: `calc(100vh - ${theme.spacing(8)}px)`,
    overflow: 'scroll',
    paddingTop: theme.spacing(10)
  }
}))

const RoomPlayersList = ({ roomState, mePlayer, myTurns, setError }) => {
  const classes = useStyles()
  const [players, setPlayers] = React.useState([])
  const [challengerPlayer, setChallengerPlayer] = React.useState()

  React.useEffect(() => {
    if (!roomState) return

    setPlayers(roomState.all_players || [])
  }, [roomState])

  React.useEffect(() => {
    if (!roomState) return

    setChallengerPlayer(
      players.find(player => player.id === roomState.challenger_player_id)
    )
  }, [roomState, players])

  if (players.length === 0) {
    return (
      <Box display="flex" justifyContent="center" paddingTop={4}>
        <Typography variant="h5" component="h2">
          No players.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="space-around"
      className={classes.root}
    >
      {players.map(player => (
        <Box key={player.id}>
          <RoomPlayer
            player={player}
            roomState={roomState}
            mePlayer={mePlayer}
            myTurns={myTurns}
            challengerPlayer={challengerPlayer}
            setError={setError}
          />
        </Box>
      ))}
      {!roomState.all_turns && <RoomPLayerGhost />}
    </Box>
  )
}

export default RoomPlayersList
