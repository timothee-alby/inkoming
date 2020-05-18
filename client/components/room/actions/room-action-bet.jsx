import React from 'react'
import { SpeedDialAction, SpeedDialIcon } from '@material-ui/lab/'
import { makeStyles } from '@material-ui/core/styles'
import BetActionIcon from '~/components/icons/bet-action-icon'
import CloseIcon from '@material-ui/icons/Close'
import RoomActionChooseBet from '~/components/room/actions/room-action-choose-bet'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  tooltip: {
    background: 'none',
    boxShadow: 'none',
    padding: 0
  },
  speeDialRoot: {
    height: '35px'
  },
  openIcon: {
    transform: 'none'
  }
}))

const RoomActionBet = props => {
  const { t } = useTranslation()
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
          icon={<BetActionIcon fontSize="large" />}
          openIcon={<CloseIcon fontSize="large" />}
          open={choosingBet}
          classes={{ root: classes.speeDialRoot, openIcon: classes.openIcon }}
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
          t('play bet')
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
