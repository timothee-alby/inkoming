import OError from '@overleaf/o-error'
import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import RoundResetDialog from '~/components/room/round-reset-dialog'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  headerButton: {
    minWidth: 'auto',
    marginRight: theme.spacing(1)
  }
}))

const RoundReset = ({ buttonVariant, size, roomState, player, setError }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const showTimeout = React.useRef()
  const { userJwt } = useAuth()

  if (!showTimeout.current) {
    showTimeout.current = window.setTimeout(() => {
      setIsDialogOpen(true)
    }, 3000)
  }

  const resetRound = async () => {
    try {
      await milou({
        method: 'POST',
        url: `${process.env.API_URL}/rpc/reset_round`,
        jwt: userJwt,
        body: {
          player_id: player.id
        }
      })
    } catch (error) {
      setError(
        OError.tag(error, 'cannot reset round', {
          clientContextKey: 'round_reset',
          retryable: true
        })
      )
    }
  }

  return (
    <>
      <Button
        variant={buttonVariant}
        size={size}
        className={classes.headerButton}
        type="submit"
        color="secondary"
        onClick={() => setIsDialogOpen(true)}
      >
        {t('reset round')}&hellip;
      </Button>
      <RoundResetDialog
        resetRound={resetRound}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        roomState={roomState}
      />
    </>
  )
}

export default RoundReset
