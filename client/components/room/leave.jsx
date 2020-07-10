import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { useTranslation } from 'react-i18next'
import RoomLeaveDialog from '~/components/room/leave-dialog'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    bottom: theme.spacing(6),
    left: theme.spacing(6),
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.main
    }
  }
}))

const RoomLeave = ({ playerId, setError }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const handleClick = async () => {
    setIsDialogOpen(true)
  }

  return (
    <>
      <IconButton
        className={classes.root}
        onClick={handleClick}
        aria-label={t('leave room')}
      >
        <ExitToAppIcon />
      </IconButton>
      <RoomLeaveDialog
        playerId={playerId}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setError={setError}
      />
    </>
  )
}

export default RoomLeave
