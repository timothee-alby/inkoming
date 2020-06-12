import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import RoomCreate from '~/components/rooms/create'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(theme => ({
  heroText: {
    color: theme.palette.common.white,
    textAlign: 'center'
  }
}))

const RoomsList = () => {
  const { t } = useTranslation()
  const classes = useStyles()
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        paddingTop={4}
        className={classes.heroText}
      >
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
