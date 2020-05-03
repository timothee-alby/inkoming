import React from 'react'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import { Badge } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SpaIcon from '@material-ui/icons/Spa'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'

const useStyles = makeStyles(theme => ({
  badge: {
    marginTop: theme.spacing(4)
  },
  action: {
    marginTop: theme.spacing(3) * -1
  },
  iconRed: {
    color: theme.palette.card.red
  },
  iconBlack: {
    color: theme.palette.card.black
  }
}))

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
  const classes = useStyles()
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
      className={classes.badge}
    >
      <SpeedDialAction
        {...speedDialActionProps}
        key={colour}
        icon={
          <SpaIcon
            className={colour === 'red' ? classes.iconRed : classes.iconBlack}
          />
        }
        disabled={!canClick}
        tooltipTitle={`Play ${colour}`}
        onClick={handleClick}
        className={classes.action}
      />
    </Badge>
  )
}

export default RoomActionCard
