import React from 'react'
import { Box, Typography, Badge } from '@material-ui/core'

const RoomPlayersList = ({ player, roomState }) => {
  const isNext = player.id === roomState.next_player_id
  return (
    <Box>
      {isNext && (
        <Badge color="secondary" badgeContent="next">
          <Typography variant="h6">{player.nickname}</Typography>
        </Badge>
      )}
      {!isNext && <Typography variant="h6">{player.nickname}</Typography>}
      <Typography variant="subtitle2">{player.points} points</Typography>
      <Typography variant="subtitle2">{player.total_cards} cards</Typography>
    </Box>
  )
}

export default RoomPlayersList
