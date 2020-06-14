import React from 'react'
import { Tab } from '@material-ui/core/'
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow'
import HelpIcon from '@material-ui/icons/HelpOutline'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.common.white,
    minHeight: 'unset',
    minWidth: 'unset',
    paddingLeft: 0,
    paddingRight: theme.spacing(1),
    '& .MuiTab-wrapper > :first-child': {
      marginBottom: 0
    },
    opacity: 1
  },
  wrapper: {
    flexDirection: 'row'
  },
  icon: {
    marginRight: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize
  }
}))

const TutorialTab = ({
  step,
  disabled,
  isFirst,
  highlightedStep,
  setHighlightedStep,
  showDescription,
  setShowDescription
}) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const handleClick = (event, step) => {
    if (step === highlightedStep) {
      return setShowDescription(!showDescription)
    }
    setHighlightedStep(step)
    setShowDescription(true)
  }

  return (
    <Tab
      label={t(`tutorial.${step}.title`)}
      className={classes.root}
      classes={{ wrapper: classes.wrapper }}
      disabled={disabled}
      onClick={e => {
        handleClick(e, step)
      }}
      icon={
        isFirst ? (
          <HelpIcon className={classes.icon} />
        ) : (
          <DoubleArrowIcon className={classes.icon} />
        )
      }
    />
  )
}

export default TutorialTab
