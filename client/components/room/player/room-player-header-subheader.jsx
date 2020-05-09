import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import PlayingCard from '~/components/room/playing-card'

const useStyles = makeStyles(theme => ({
  playingCard: {
    color: theme.palette.card.unknown
  },
  playingCardStacked: {
    marginRight: theme.spacing(1) * -1
  }
}))

const RommPlayerHeaderSubheader = ({ player }) => {
  const classes = useStyles()
  const [visibleCards, setVisibleCards] = React.useState([])

  React.useEffect(() => {
    if (!player) return

    if (player.total_cards) {
      return setVisibleCards(
        Array(player.total_cards - player.carded_cards).fill('unknown')
      )
    }

    setVisibleCards([])
  }, [player])

  return (
    <>
      {visibleCards.map((card, idx) => (
        <PlayingCard
          key={idx}
          colour={card}
          className={clsx({
            [classes.playingCard]: true,
            [classes.playingCardStacked]: idx < visibleCards.length - 1
          })}
        />
      ))}
    </>
  )
}

export default RommPlayerHeaderSubheader
