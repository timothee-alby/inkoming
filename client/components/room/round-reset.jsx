import React from 'react'
import { Button } from '@material-ui/core'
import CachedIcon from '@material-ui/icons/Cached'
import RoundResetDialog from '~/components/room/round-reset-dialog'
import { useAuth } from '~/components/auth/auth-context'
import milou from '~/lib/milou'
import { useTranslation } from 'react-i18next'

const RoundReset = ({ buttonVariant, roomState, player, setError }) => {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const { userJwt } = useAuth()

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
        type="submit"
        color="secondary"
        startIcon={<CachedIcon />}
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
