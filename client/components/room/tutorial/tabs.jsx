import React from 'react'
import clsx from 'clsx'
import { Tabs } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import TutorialTab from '~/components/room/tutorial/tab'

const useStyles = makeStyles(theme => ({
  tabs: {
    minHeight: 'unset',
    '& .MuiTabs-scroller': {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(10)
    },
    paddingRight: theme.spacing(10)
  }
}))

const TutorialTabs = ({
  steps,
  highlightedStep,
  gameCurrentStepId,
  showDescription,
  setShowDescription,
  setHighlightedStep
}) => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Tabs
      indicatorColor="secondary"
      textColor="secondary"
      variant="scrollable"
      scrollButtons="off"
      aria-label={t('tutorial label')}
      className={clsx([classes.tabs, 'MuiPaper-elevation2'])}
      value={highlightedStep}
    >
      {steps.map((step, stepId) => (
        <TutorialTab
          value={step}
          key={stepId}
          step={step}
          disabled={stepId > gameCurrentStepId}
          isFirst={stepId === 0}
          highlightedStep={highlightedStep}
          setHighlightedStep={setHighlightedStep}
          showDescription={showDescription}
          setShowDescription={setShowDescription}
        />
      ))}
    </Tabs>
  )
}

export default TutorialTabs
