import OError from '@overleaf/o-error'
import React from 'react'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import FoldIcon from '~/components/icons/fold-icon'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'
import { useTranslation } from 'react-i18next'

const RoomActionFold = props => {
  const { t } = useTranslation()
  const {
    roomState,
    player,
    playerTurns,
    setPlayerTurns,
    playerIsNext,
    setError,
    setOpen,
    labelDisabledClass,
    ...speedDialActionProps
  } = props
  const { userJwt, isBeginner } = useAuth()

  const handleClick = async () => {
    if (!playerIsNext) return

    try {
      await milou({
        method: 'POST',
        url: `${process.env.API_URL}/turns`,
        jwt: userJwt,
        body: {
          player_id: player.id,
          fold: true
        }
      })
      setOpen(false)
    } catch (error) {
      setError(
        OError.tag(error, 'cannot fold', {
          clientContextKey: 'fold',
          retryable: true
        })
      )
    }
  }

  if (!playerIsNext) {
    speedDialActionProps.FabProps.classes = { label: labelDisabledClass }
  }

  return (
    <SpeedDialAction
      {...speedDialActionProps}
      key="fold"
      icon={<FoldIcon fontSize="large" />}
      tooltipTitle={t('play fold')}
      tooltipOpen={isBeginner}
      onClick={handleClick}
      disabled={!playerIsNext}
    />
  )
}

export default RoomActionFold
