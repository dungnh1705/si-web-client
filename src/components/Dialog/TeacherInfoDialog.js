import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, Divider, DialogContent, DialogActions, Button, Grid, Avatar } from '@material-ui/core'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { TeacherInfoDialogAtom } from './recoil'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { UserImageSelector } from 'recoils/selectors'

export const TeacherInfoDialog = () => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [infoDialog, setInfoDialog] = useRecoilState(TeacherInfoDialogAtom)
  const { open, info } = infoDialog

  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    if (info) {
      setAvatar(UserImageSelector(info.id, info.croppedAvatarId))
    }
  }, [info])

  const handleCloseDialog = () => {
    setInfoDialog({ ...infoDialog, open: false, info: undefined })
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="responsive-roles-dialog" fullScreen={fullScreen} maxWidth="lg" style={{ minWidth: '400px' }}>
      <DialogTitle>Thông tin Huynh Trưởng</DialogTitle>
      <Divider />
      <DialogContent style={{ minWidth: '400px' }}>
        <Grid container spacing={2} justifyContent={'center'} alignItems={'center'}>
          <Grid item xs={12}>
            <div className="text-center pt-4">
              <div className="avatar-icon-wrapper rounded-circle m-0">
                <Avatar
                  className="avatar-icon rounded-circle border-white border-3 mb-3 d-120"
                  alt={`${info?.firstName} ${info?.lastName}`}
                  src={avatar ?? ''}
                  style={{ fontSize: '3.25rem', cursor: 'pointer' }}>
                  {`${info?.firstName?.substring(0, 1)}${info?.lastName?.substring(0, 1)}`}
                </Avatar>
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
