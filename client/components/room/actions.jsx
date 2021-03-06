import React from 'react'
import { SpeedDial, SpeedDialIcon } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import RoomActionCard from '~/components/room/actions/room-action-card'
import RoomActionFold from '~/components/room/actions/room-action-fold'
import RoomActionBet from '~/components/room/actions/room-action-bet'
import ActionsIcon from '~/components/icons/actions-icon'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: 'fixed',
    top: theme.spacing(7),
    right: theme.spacing(1),
    whiteSpace: 'nowrap' // for tooltips
  },
  fab: {
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.grey[400]
    }
  },
  labelDisabled: {
    opacity: 0.2
  },
  speedDialIconRoot: {
    height: theme.spacing(8),
    color: theme.palette.action.active
  },
  speedDialIconIcon: {
    fontSize: theme.spacing(8)
  },
  speedDialIconOpenIcon: {
    fontSize: theme.spacing(6),
    margin: theme.spacing(1)
  },
  tooltipPopperHide: {
    display: 'none'
  }
}))

const RoomActions = props => {
  const classes = useStyles()
  const [choosingBet, setChoosingBet] = React.useState(false)
  const { roomState, open, setOpen } = props

  const handleOpen = (e, reason) => {
    if (reason === 'mouseEnter') return
    setOpen(true)
  }

  const handleClose = (e, reason) => {
    if (reason === 'mouseLeave') return
    setOpen(false)
  }

  return (
    <SpeedDial
      ariaLabel="Actions"
      classes={{ root: classes.speedDial, fab: classes.fab }}
      icon={
        <SpeedDialIcon
          icon={<ActionsIcon />}
          openIcon={<CloseIcon />}
          classes={{
            root: classes.speedDialIconRoot,
            icon: classes.speedDialIconIcon,
            openIcon: classes.speedDialIconOpenIcon
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
          choosingBet={choosingBet}
          className={classes.fab}
          labelDisabledClass={classes.labelDisabled}
          TooltipClasses={{ popper: classes.tooltipPopperHide }}
          FabProps={{ size: 'medium' }}
          colour="red"
        />
      )}
      {roomState.can_card && (
        <RoomActionCard
          {...props}
          setOpen={setOpen}
          choosingBet={choosingBet}
          className={classes.fab}
          labelDisabledClass={classes.labelDisabled}
          TooltipClasses={{ popper: classes.tooltipPopperHide }}
          FabProps={{ size: 'medium' }}
          colour="black"
        />
      )}
      {roomState.can_bet && (
        <RoomActionBet
          {...props}
          setOpen={setOpen}
          choosingBet={choosingBet}
          setChoosingBet={setChoosingBet}
          className={classes.fab}
          labelDisabledClass={classes.labelDisabled}
          TooltipClasses={{ popper: classes.tooltipPopperHide }}
          FabProps={{ size: 'medium' }}
        />
      )}
      {roomState.can_bet && !roomState.can_card && (
        <RoomActionFold
          {...props}
          setOpen={setOpen}
          choosingBet={choosingBet}
          className={classes.fab}
          labelDisabledClass={classes.labelDisabled}
          TooltipClasses={{ popper: classes.tooltipPopperHide }}
          FabProps={{ size: 'medium' }}
        />
      )}
    </SpeedDial>
  )
}

export default RoomActions
