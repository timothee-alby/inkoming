import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import PlayingCard from '~/components/room/playing-card'

const useStyles = makeStyles(theme => ({
  playingCard: {
    height: '20px',
    width: '20px'
  },
  playingCardStacked: {
    marginRight: theme.spacing(1) * -1
  }
}))

const RoomPlayerHeaderSubheader = ({ playerTotalCards, playerCardedCards }) => {
  const classes = useStyles()

  const visibleCards = React.useMemo(() => {
    if (!playerTotalCards) return []
    return Array(playerTotalCards - playerCardedCards).fill('unknown')
  }, [playerTotalCards, playerCardedCards])

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

export default RoomPlayerHeaderSubheader
