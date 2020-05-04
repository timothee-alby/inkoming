import React from 'react'
import { SpeedDial, SpeedDialIcon } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import SportsVolleyballIcon from '@material-ui/icons/SportsVolleyball'
import RoomActionCard from '~/components/room/actions/room-action-card'
import RoomActionFold from '~/components/room/actions/room-action-fold'
import RoomActionBet from '~/components/room/actions/room-action-bet'

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: 'absolute',
    top: theme.spacing(10),
    right: theme.spacing(2)
  }
}))

const RoomActions = props => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const { roomState, player } = props

  React.useEffect(() => {
    if (roomState.next_player_id === player.id) {
      setOpen(true)
    }
  }, [roomState, player])

  const handleOpen = (e, reason) => {
    if (reason === 'mouseEnter') return
    setOpen(true)
  }

  const handleClose = (e, reason) => {
    if (reason === 'mouseLeave') return
    setOpen(false)
  }

  if (!roomState.can_card && !roomState.can_bet) {
    return null
  }

  return (
    <SpeedDial
      ariaLabel="Actions"
      className={classes.speedDial}
      icon={<SpeedDialIcon icon={<SportsVolleyballIcon />} />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction="down"
    >
      {roomState.can_card && (
        <RoomActionCard {...props} setOpen={setOpen} colour="red" />
      )}
      {roomState.can_card && (
        <RoomActionCard {...props} setOpen={setOpen} colour="black" />
      )}
      {roomState.can_bet && <RoomActionBet {...props} setOpen={setOpen} />}
      {roomState.can_bet && !roomState.can_card && (
        <RoomActionFold {...props} setOpen={setOpen} />
      )}
    </SpeedDial>
  )
}

export default RoomActions
