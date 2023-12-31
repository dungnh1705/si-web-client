import React from 'react'
import { useRecoilState } from 'recoil'
import { Dialog, DialogTitle, DialogContent, Typography, Button, DialogActions, Divider, Grid } from '@material-ui/core'

import { PhoneCallDialogAtom } from './recoil'

export const DialerDialog = () => {
  const [phoneDialog, setPhoneDialog] = useRecoilState(PhoneCallDialogAtom)
  const { phoneCallDialog, phoneNo } = phoneDialog

  const handleClose = () => {
    setPhoneDialog({ ...phoneDialog, phoneCallDialog: false, phoneNo: undefined })
  }

  const handleCall = () => {
    if (phoneNo) window.open(`tel:${phoneNo}`)
    handleClose()
  }

  return (
    <Dialog open={phoneCallDialog} onClose={handleClose}>
      <DialogTitle>Gọi điện thoại</DialogTitle>
      <Divider />
      <DialogContent style={{ minWidth: '300px' }}>
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <Typography>Thực hiện gọi SĐT</Typography>
          <br />
          <Typography variant="h3">{phoneNo}</Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Grid container item spacing={2} justifyContent="flex-end">
          <Grid item xs={6}>
            <Button size="large" onClick={handleCall} color="primary" variant="contained" fullWidth>
              Gọi
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button size="large" onClick={handleClose} variant="outlined" fullWidth>
              Quay về
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}
