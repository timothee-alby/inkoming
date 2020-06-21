import React from 'react'
import clsx from 'clsx'
import { AppBar, Backdrop } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from '~/components/auth/auth-context'
import TutorialTabs from '~/components/room/tutorial/tabs'
import TutorialContent from '~/components/room/tutorial/content'

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: 15,
    top: theme.spacing(6),
    backgroundColor: theme.palette.background.header.main,
    color: theme.palette.background.header.gradient
  },
  backdrop: {
    zIndex: 10
  }
}))

const Tutorial = ({ roomState, steps, gameCurrentStepId }) => {
  const { isBeginner } = useAuth()
  const classes = useStyles()
  const [highlightedStep, setHighlightedStep] = React.useState(
    steps[gameCurrentStepId]
  )

  React.useEffect(() => {
    setHighlightedStep(steps[gameCurrentStepId])
  }, [steps, gameCurrentStepId])

  return (
    <>
      <Backdrop className={classes.backdrop} open={isBeginner} />
      <AppBar
        position="fixed"
        className={clsx([[classes.appBar], 'pattern-cross-dots-sm'])}
      >
        <TutorialTabs
          steps={steps}
          highlightedStep={highlightedStep}
          gameCurrentStepId={gameCurrentStepId}
          setHighlightedStep={setHighlightedStep}
        />
        <TutorialContent
          highlightedStep={highlightedStep}
          roomState={roomState}
        />
      </AppBar>
    </>
  )
}

export default Tutorial
