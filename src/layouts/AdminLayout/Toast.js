import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { useRecoilState } from 'recoil'
import { toastState } from 'recoils/atoms'
import ToastMessageWrapper from './ToastMessageWrapper'
const Toast = () => {
  const [toast, setToast] = useRecoilState(toastState)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setToast({ ...toast, open: false })
  }
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={toast.open}
      autoHideDuration={2000}
      onClose={handleClose}>
      <ToastMessageWrapper onClose={handleClose} variant={toast.type} message={toast.message} title={toast.title} />
    </Snackbar>
  )
}

export default Toast
