import React from 'react'
import clsx from 'clsx'
import { AppBar, Box, Tabs, Tab, Typography } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: 15,
    top: theme.spacing(6),
    backgroundColor: theme.palette.background.header.main,
    color: theme.palette.background.header.gradient
  },
  root: {
    marginTop: theme.spacing(2)
  },
  tabs: {
    minHeight: 'unset'
  },
  tab: {
    color: theme.palette.common.white,
    minHeight: 'unset'
  },
  tabPanel: {
    backgroundColor: theme.palette.background.header.main,
    color: theme.palette.background.header.gradient
  },
  tabPanelContent: {
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    paddingRight: theme.spacing(9),
    whiteSpace: 'pre-line'
  }
}))

const RoomNotification = ({ roomState, steps, currentStepId }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [visibleStep, setVisibleStep] = React.useState(steps[currentStepId])
  const [showDescription, setShowDescription] = React.useState(false)

  React.useEffect(() => {
    setVisibleStep(steps[currentStepId])
  }, [steps, currentStepId])

  const handleClick = (event, step) => {
    if (step === visibleStep) {
      return setShowDescription(!showDescription)
    }
    setVisibleStep(step)
    setShowDescription(true)
  }

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx([[classes.appBar], 'pattern-cross-dots-sm'])}
      >
        <Tabs
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="off"
          aria-label="scrollable auto tabs example"
          className={classes.tabs}
          value={visibleStep}
        >
          {steps.map((step, idx) => (
            <Tab
              value={step}
              key={idx}
              label={t(`tutorial.${step}.title`)}
              className={classes.tab}
              disabled={idx > currentStepId}
              id={`scrollable-auto-tab-${idx}`}
              aria-controls={`scrollable-auto-tabpanel-${idx}`}
              onClick={e => {
                handleClick(e, step)
              }}
            />
          ))}
        </Tabs>
        <Box
          role="tabpanel"
          hidden={!showDescription}
          id={`scrollable-auto-tabpanel-${visibleStep}`}
          aria-labelledby={`scrollable-auto-tab-${visibleStep}`}
          className={clsx([[classes.tabPanel], 'pattern-cross-dots-sm'])}
        >
          <Box className={classes.tabPanelContent}>
            <Typography>
              {t(`tutorial.${visibleStep}.description`, roomState)}
            </Typography>
          </Box>
        </Box>
      </AppBar>
    </>
  )
}

export default RoomNotification
