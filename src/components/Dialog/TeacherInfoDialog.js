import React from 'react'
import { Dialog, DialogTitle, Divider, DialogContent, DialogActions, Button, Tooltip, IconButton, Grid, Card } from '@material-ui/core'
import { useRecoilState } from 'recoil'
import { TeacherInfoDialogAtom } from './recoil'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

export const TeacherInfoDialog = () => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [infoDialog, setInfoDialog] = useRecoilState(TeacherInfoDialogAtom)
  const { open, info } = infoDialog

  const handleCloseDialog = () => {
    setInfoDialog({ ...infoDialog, open: false, info: undefined })
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="responsive-roles-dialog" fullScreen={fullScreen} maxWidth="lg">
      <DialogTitle>Thông tin Huynh Trưởng</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container item xs={12} spacing={2} justifyContent={'center'}>
          <div className="text-center pt-4">
            <div className="avatar-icon-wrapper rounded-circle m-0">
              <div className="d-block p-0 avatar-icon-wrapper m-0 d-90">
                <div className="rounded-circle overflow-hidden">
                  <img alt="..." className="img-fluid" />
                </div>
              </div>
            </div>
            <div>
              <span className="my-2 text-success font-size-md px-4 py-1 h-auto badge badge-neutral-success">Online</span>
            </div>
            <h3 className="font-weight-bold mt-3">{info?.fullName}</h3>
            <p className="mb-0 text-black-50">
              Senior Frontend Developer at <b>Google Inc.</b>
            </p>
          </div>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={handleCloseDialog} variant="outlined">
          Quay về
        </Button>
      </DialogActions>
    </Dialog>
  )
}
