import OError from '@overleaf/o-error'
import React from 'react'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import { Badge } from '@material-ui/core'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'
import PlayingCard from '~/components/room/playing-card'
import { useTranslation } from 'react-i18next'

const RoomActionCard = props => {
  const { t } = useTranslation()
  const {
    roomState,
    player,
    playerTurns,
    setPlayerTurns,
    playerIsNext,
    setError,
    setOpen,
    colour,
    labelDisabledClass,
    ...speedDialActionProps
  } = props
  const { userJwt, isBeginner } = useAuth()
  const [remainingCount, setRemainingCount] = React.useState()
  const [canClick, setCanClick] = React.useState()

  React.useEffect(() => {
    const total = player.cards.filter(card => card === colour).length
    const used = playerTurns.filter(turn => turn.card === colour).length
    setRemainingCount(total - used)
  }, [roomState, player, playerTurns, colour])

  React.useEffect(() => {
    setCanClick(playerIsNext && remainingCount > 0)
  }, [playerIsNext, remainingCount])

  const handleClick = async () => {
    try {
      const turn = await milou({
        method: 'POST',
        url: `${process.env.API_URL}/turns`,
        jwt: userJwt,
        body: {
          player_id: player.id,
          card: colour
        }
      })
      setPlayerTurns([...playerTurns, turn])
      setOpen(false)
    } catch (error) {
      setError(
        OError.tag(error, 'cannot card', {
          clientContextKey: 'card',
          retryable: true
        })
      )
    }
  }

  if (!canClick) {
    speedDialActionProps.FabProps.classes = { label: labelDisabledClass }
  }

  return (
    <Badge
      color="secondary"
      overlap="circle"
      badgeContent={remainingCount}
      invisible={!speedDialActionProps.open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
    >
      <SpeedDialAction
        {...speedDialActionProps}
        key={colour}
        icon={<PlayingCard colour={colour} fontSize="large" />}
        disabled={!canClick}
        tooltipTitle={t(`play ${colour}`)}
        onClick={handleClick}
        tooltipOpen={isBeginner}
      />
    </Badge>
  )
}

export default RoomActionCard
