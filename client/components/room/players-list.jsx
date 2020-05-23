import React from 'react'
import { Box } from '@material-ui/core'
import RoomPlayerManager from '~/components/room/player-manager'
import RommPlayerGhost from '~/components/room/player-ghost'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100%'
  }
}))

const RoomPlayersList = ({ roomState, mePlayer, myTurns, setError }) => {
  const classes = useStyles()

  const players = React.useMemo(() => {
    return roomState.all_players || []
  }, [roomState])

  const challengerPlayer = React.useMemo(() => {
    return players.find(player => player.id === roomState.challenger_player_id)
  }, [roomState, players])

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
          <RoomPlayerManager
            player={player}
            roomState={roomState}
            mePlayer={mePlayer}
            myTurns={myTurns}
            challengerPlayer={challengerPlayer}
            setError={setError}
          />
        </Box>
      ))}
      {!roomState.all_turns && <RommPlayerGhost />}
    </Box>
  )
}

export default RoomPlayersList
