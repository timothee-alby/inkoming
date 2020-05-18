import React from 'react'
import { Box, Typography } from '@material-ui/core'
import RoomCreate from '~/components/rooms/create'
import { useTranslation } from 'react-i18next'

const RoomsList = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box display="flex" justifyContent="center" paddingTop={4}>
        <Typography variant="h5" component="h2">
          {t('no rooms yet')}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" padding={4}>
        <RoomCreate buttonVariant="contained" />
      </Box>
    </>
  )
}

export default RoomsList
