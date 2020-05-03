import React from 'react'
import { SpeedDialAction, SpeedDialIcon } from '@material-ui/lab/'
import { makeStyles } from '@material-ui/core/styles'
import GavelIcon from '@material-ui/icons/Gavel'
import CloseIcon from '@material-ui/icons/Close'
import RoomActionChooseBet from '~/components/room/actions/room-action-choose-bet'

const useStyles = makeStyles(theme => ({
  tooltip: {
    background: 'none',
    boxShadow: 'none',
    padding: 0
  }
}))

const RoomActionBet = props => {
  const {
    roomState,
    player,
    playerTurns,
    setPlayerTurns,
    playerIsNext,
    setError,
    setOpen,
    ...speedDialActionProps
  } = props
  const classes = useStyles()
  const [choosingBet, setChoosingBet] = React.useState()

  React.useEffect(() => {}, [])

  const handleClick = async () => {
    setChoosingBet(!choosingBet)
  }

  return (
    <SpeedDialAction
      {...speedDialActionProps}
      key="bet"
      icon={
        <SpeedDialIcon
          icon={<GavelIcon />}
          openIcon={<CloseIcon />}
          open={choosingBet}
        />
      }
      tooltipTitle={
        choosingBet ? (
          <RoomActionChooseBet
            roomState={roomState}
            player={player}
            setOpen={setOpen}
            setError={setError}
          />
        ) : (
          'Bet...'
        )
      }
      tooltipOpen={choosingBet}
      classes={{ staticTooltipLabel: classes.tooltip }}
      onClick={handleClick}
      disabled={!playerIsNext}
    />
  )
}

export default RoomActionBet
