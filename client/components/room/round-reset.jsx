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
  const [isDialogOpen, setIsDialogOpen] = React.useState(true)
  const { userJwt } = useAuth()
  let showTimeout = null
  if (!showTimeout) {
    showTimeout = window.setTimeout(() => {
      if (isDialogOpen) return
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
      setError(error)
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
