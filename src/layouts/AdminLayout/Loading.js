import React from 'react'
import { Dialog, DialogContent, CircularProgress } from '@material-ui/core'
import { useRecoilValue } from 'recoil'
import { loadingState } from 'recoils/atoms'

const Loading = () => {
  const loadingFlag = useRecoilValue(loadingState)

  return (
    <Dialog open={loadingFlag} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogContent>
        <CircularProgress />
      </DialogContent>
    </Dialog>
  )
}

export default Loading
