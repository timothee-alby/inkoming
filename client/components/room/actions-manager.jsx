import React from 'react'
import RoomActions from '~/components/room/actions'
import RoomActionsDialog from '~/components/room/actions-dialog'

const RoomActionsManager = ({
  roomState,
  player,
  myTurns,
  setMyTurns,
  mePlayerIsNext,
  setError
}) => {
  const [open, setOpen] = React.useState(false)
  const [isActionDialogOpen, setIsActionDialogOpen] = React.useState(false)
  const showTimeout = React.useRef()

  React.useEffect(() => {
    if (showTimeout.current) {
      window.clearTimeout(showTimeout.current)
    }

    if (mePlayerIsNext) {
      setOpen(true)
      showTimeout.current = window.setTimeout(() => {
        setIsActionDialogOpen(true)
      }, 30000)
    } else {
      setIsActionDialogOpen(false)
    }
  }, [mePlayerIsNext])

  if (!roomState.can_card && !roomState.can_bet) {
    return null
  }

  return (
    <>
      <RoomActions
        roomState={roomState}
        player={player}
        playerTurns={myTurns}
        open={open}
        setOpen={setOpen}
        setPlayerTurns={setMyTurns}
        playerIsNext={mePlayerIsNext}
        setError={setError}
      />
      <RoomActionsDialog
        isDialogOpen={isActionDialogOpen}
        setIsDialogOpen={setIsActionDialogOpen}
      />
    </>
  )
}

export default RoomActionsManager
