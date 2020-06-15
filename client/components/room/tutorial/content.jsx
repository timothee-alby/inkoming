import React from 'react'
import clsx from 'clsx'
import { Box, Collapse, Typography } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import TutorialContentClose from '~/components/room/tutorial/content-close'

const useStyles = makeStyles(theme => ({
  collapse: {
    zIndex: -1
  },
  tabPanel: {
    backgroundColor: theme.palette.background.header.main,
    color: theme.palette.background.header.gradient
  },
  tabPanelContent: {
    color: theme.palette.common.white,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    whiteSpace: 'pre-line'
  }
}))

const TutorialContent = ({
  highlightedStep,
  showDescription,
  setShowDescription,
  roomState
}) => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Collapse in={showDescription} className={classes.collapse}>
      <Box
        role="tabpanel"
        aria-hidden={!showDescription}
        aria-labelledby={`scrollable-auto-tab-${highlightedStep}`}
        className={clsx([[classes.tabPanel], 'pattern-cross-dots-sm'])}
      >
        <Box className={classes.tabPanelContent}>
          <Typography>
            {t(`tutorial.${highlightedStep}.description`, roomState)}
          </Typography>
        </Box>
        <TutorialContentClose
          showDescription={showDescription}
          setShowDescription={setShowDescription}
        />
      </Box>
    </Collapse>
  )
}

export default TutorialContent
