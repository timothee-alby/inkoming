import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButtonPlayerAction from '~/components/elements/icon-button-player-action'

import FoldIcon from '~/components/icons/fold-icon'
import Filter1Icon from '@material-ui/icons/Filter1'
import Filter2Icon from '@material-ui/icons/Filter2'
import Filter3Icon from '@material-ui/icons/Filter3'
import Filter4Icon from '@material-ui/icons/Filter4'
import Filter5Icon from '@material-ui/icons/Filter5'
import Filter6Icon from '@material-ui/icons/Filter6'
import Filter7Icon from '@material-ui/icons/Filter7'
import Filter8Icon from '@material-ui/icons/Filter8'
import Filter9Icon from '@material-ui/icons/Filter9'
import Filter9PlusIcon from '@material-ui/icons/Filter9Plus'

const betIcons = {
  1: Filter1Icon,
  2: Filter2Icon,
  3: Filter3Icon,
  4: Filter4Icon,
  5: Filter5Icon,
  6: Filter6Icon,
  7: Filter7Icon,
  8: Filter8Icon,
  9: Filter9Icon,
  10: Filter9PlusIcon
}

const useStyles = makeStyles(theme => ({
  actionIcon: {
    fontSize: 40,
    padding: 0,
    marginRight: theme.spacing(3) * -1,
    marginTop: theme.spacing(3) * -1
  }
}))

const PlayingBet = ({ turns }) => {
  const classes = useStyles()
  const [maxBet, setMaxBet] = React.useState(null)
  const [folded, setFolded] = React.useState(false)
  const [BetIcon, setBetIcon] = React.useState(null)

  React.useEffect(() => {
    if (turns.find(turn => turn.fold)) {
      setFolded(true)
    } else {
      setMaxBet(
        Math.max.apply(
          Math,
          turns.map(turn => turn.bet)
        )
      )
    }
  }, [turns])

  React.useEffect(() => {
    const betIndex = maxBet > 9 ? 10 : maxBet
    setBetIcon(betIcons[betIndex])
  }, [maxBet])

  return (
    <IconButtonPlayerAction aria-label={maxBet} disabled>
      {folded && <FoldIcon className={classes.actionIcon} />}
      {!folded && BetIcon && <BetIcon className={classes.actionIcon} />}
    </IconButtonPlayerAction>
  )
}

export default PlayingBet
