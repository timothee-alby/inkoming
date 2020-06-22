import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FoldIcon from '~/components/icons/fold-icon'
import BetLabelIcon from '~/components/icons/bet-label-icon'

const useStyles = makeStyles(theme => ({
  actionIcon: {
    fontSize: theme.spacing(5),
    animation:
      'slide-bck-center 0.45s cubic-bezier(0.470, 0.000, 0.745, 0.715) both'
  }
}))

const PlayingBet = ({ turns }) => {
  const classes = useStyles()
  const [maxBet, setMaxBet] = React.useState(null)
  const [folded, setFolded] = React.useState(false)

  React.useEffect(() => {
    if (turns.find(turn => turn.fold)) {
      setFolded(true)
    } else {
      setFolded(false)
      setMaxBet(
        Math.max.apply(
          Math,
          turns.map(turn => turn.bet)
        )
      )
    }
  }, [turns])

  if (folded) {
    return <FoldIcon className={classes.actionIcon} />
  } else if (maxBet > 0) {
    return (
      <BetLabelIcon
        key={maxBet}
        className={classes.actionIcon}
        label={maxBet}
      />
    )
  }

  return null
}

export default PlayingBet
