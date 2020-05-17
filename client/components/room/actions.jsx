import React from 'react'
import { SpeedDial, SpeedDialIcon } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import RoomActionCard from '~/components/room/actions/room-action-card'
import RoomActionFold from '~/components/room/actions/room-action-fold'
import RoomActionBet from '~/components/room/actions/room-action-bet'
import ActionsIcon from '~/components/icons/actions-icon'

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: 'absolute',
    top: theme.spacing(10),
    right: theme.spacing(2)
  },
  fab: {
    borderRadius: '4px',
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
    }
  },
  speedDialIconRoot: {
    height: theme.spacing(8)
  },
  speedDialIconIcon: {
    fontSize: theme.spacing(8)
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
      classes={{ root: classes.speedDial, fab: classes.fab }}
      icon={
        <SpeedDialIcon
          icon={<ActionsIcon />}
          classes={{
            root: classes.speedDialIconRoot,
            icon: classes.speedDialIconIcon
          }}
        />
      }
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      direction="down"
    >
      {roomState.can_card && (
        <RoomActionCard
          {...props}
          setOpen={setOpen}
          className={classes.fab}
          FabProps={{ size: 'medium' }}
          colour="red"
        />
      )}
      {roomState.can_card && (
        <RoomActionCard
          {...props}
          setOpen={setOpen}
          className={classes.fab}
          FabProps={{ size: 'medium' }}
          colour="black"
        />
      )}
      {roomState.can_bet && (
        <RoomActionBet
          {...props}
          setOpen={setOpen}
          className={classes.fab}
          FabProps={{ size: 'medium' }}
        />
      )}
      {roomState.can_bet && !roomState.can_card && (
        <RoomActionFold
          {...props}
          setOpen={setOpen}
          className={classes.fab}
          FabProps={{ size: 'medium' }}
        />
      )}
    </SpeedDial>
  )
}

export default RoomActions
