import React from 'react'
import clsx from 'clsx'
import { IconButton } from '@material-ui/core/'
import CancelIcon from '@material-ui/icons/Cancel'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.common.white,
    position: 'absolute',
    bottom: theme.spacing(4) * -1
  },
  hidden: {
    display: 'none'
  }
}))

const TutorialContentClose = ({ showDescription, setShowDescription }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <IconButton
      className={clsx({
        [classes.root]: true,
        [classes.hidden]: !showDescription
      })}
      onClick={() => setShowDescription(false)}
      aria-label={t('action.close')}
    >
      <CancelIcon fontSize="large" />
    </IconButton>
  )
}

export default TutorialContentClose
