import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'

export default function LoadingScreen({ ...other }) {
  const theme = useTheme()

  return (
    <Box height="100%" display="flex" alignItems="center" justifyContent="center" bgcolor={theme.palette.background.default} {...other}>
      <Box
        component={motion.div}
        animate={{
          scale: [1.2, 1, 1, 1.2, 1.2],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%']
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        sx={{
          width: 100,
          height: 100,
          borderRadius: '25%',
          position: 'absolute',
          border: `solid 3px ${theme.palette.primary.dark}`
        }}
      />

      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%']
        }}
        transition={{
          ease: 'linear',
          duration: 3.2,
          repeat: Infinity
        }}
        sx={{
          width: 120,
          height: 120,
          borderRadius: '25%',
          position: 'absolute',
          border: `solid 8px ${theme.palette.primary.dark}`
        }}
      />
    </Box>
  )
}
