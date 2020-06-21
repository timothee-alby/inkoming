import React from 'react'
import clsx from 'clsx'
import { IconButton } from '@material-ui/core/'
import { useAuth } from '~/components/auth/auth-context'
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

const TutorialContentClose = () => {
  const {
    isBeginner,
    setIsBeginner,
    tutorialCloseCount,
    setTutorialCloseCount
  } = useAuth()
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <IconButton
      className={clsx({
        [classes.root]: true,
        [classes.hidden]: !isBeginner
      })}
      onClick={() => {
        setIsBeginner(false)
        setTutorialCloseCount(tutorialCloseCount + 1)
      }}
      aria-label={t('action.close')}
    >
      <CancelIcon fontSize="large" />
    </IconButton>
  )
}

export default TutorialContentClose
