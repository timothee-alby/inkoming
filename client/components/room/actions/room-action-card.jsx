import React from 'react'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import { Badge } from '@material-ui/core'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'
import PlayingCard from '~/components/room/playing-card'

const RoomActionCard = props => {
  const {
    roomState,
    player,
    playerTurns,
    setPlayerTurns,
    playerIsNext,
    setError,
    setOpen,
    colour,
    ...speedDialActionProps
  } = props
  const { userJwt } = useAuth()
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
      setError(error)
    }
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
        tooltipTitle={`Play ${colour}`}
        onClick={handleClick}
      />
    </Badge>
  )
}

export default RoomActionCard
