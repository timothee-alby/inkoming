import React from 'react'
import { Box, CircularProgress } from '@material-ui/core'

const ContentLoading = () => {
  return (
    <Box display="flex" justifyContent="center" paddingTop={4}>
      <CircularProgress />
    </Box>
  )
}

export default ContentLoading
