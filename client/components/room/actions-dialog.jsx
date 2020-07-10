import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import ActionsIcon from '~/components/icons/actions-icon'

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.header.main,
    color: theme.palette.common.white,
    textAlign: 'center'
  },
  text: {
    color: theme.palette.common.white
  },
  icon: {
    fontSize: theme.spacing(8),
    animation: 'heartbeat 1.5s ease-in-out infinite both'
  }
}))

const ActionsDialog = ({ isDialogOpen, setIsDialogOpen }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const handleClose = () => {
    setIsDialogOpen(false)
  }

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      classes={{ paper: classes.paper }}
    >
      <DialogTitle id="form-dialog-title">
        <ActionsIcon className={classes.icon} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText classes={{ root: classes.text }}>
          {t('you are next')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          {t('action.ok')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ActionsDialog
