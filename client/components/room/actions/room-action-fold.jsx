import React from 'react'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import PanToolIcon from '@material-ui/icons/PanTool'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'

const RoomActionFold = props => {
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
  const { userJwt } = useAuth()

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
      setError(error)
    }
  }

  return (
    <SpeedDialAction
      {...speedDialActionProps}
      key="fold"
      icon={<PanToolIcon />}
      tooltipTitle="Fold"
      onClick={handleClick}
      disabled={!playerIsNext}
    />
  )
}

export default RoomActionFold
