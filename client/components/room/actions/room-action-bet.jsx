import React from 'react'
import clsx from 'clsx'
import { SpeedDialAction, SpeedDialIcon } from '@material-ui/lab/'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from '~/components/auth/auth-context'
import BetActionIcon from '~/components/icons/bet-action-icon'
import CloseIcon from '@material-ui/icons/Close'
import RoomActionChooseBet from '~/components/room/actions/room-action-choose-bet'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  choosingBetTooltip: {
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
    choosingBet,
    setChoosingBet,
    labelDisabledClass,
    ...speedDialActionProps
  } = props
  const { isBeginner } = useAuth()
  const classes = useStyles()

  const handleClick = async () => {
    setChoosingBet(!choosingBet)
  }

  if (!playerIsNext) {
    speedDialActionProps.FabProps.classes = { label: labelDisabledClass }
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
      tooltipOpen={choosingBet || isBeginner}
      classes={{
        staticTooltipLabel: clsx({ [classes.choosingBetTooltip]: choosingBet })
      }}
      onClick={handleClick}
      disabled={!playerIsNext}
    />
  )
}

export default RoomActionBet
