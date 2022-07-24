import * as React from 'react'
import { Skeleton } from '@material-ui/lab'
import { Modal as MuiModal, Card, CardHeader, CardContent, Divider } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 1080,
    height: 700,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}))

const ModalSkeleton = ({ loading }) => {
  const classes = useStyles()

  return (
    <MuiModal open={loading} aria-labelledby="simple-modal-title-skeleton">
      <Card className={classes.root}>
        <CardHeader />
        <Divider />
        <CardContent>
          <Skeleton />
        </CardContent>
        <CardContent>
          <Skeleton />
        </CardContent>
        <CardContent>
          <Skeleton />
        </CardContent>
        <CardContent>
          <Skeleton />
        </CardContent>
      </Card>
    </MuiModal>
  )
}

export default ModalSkeleton
