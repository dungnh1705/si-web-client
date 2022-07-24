import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, CardContent, Grid, FormControl, FormGroup, FormControlLabel, DialogActions, Button, TextField, Divider } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'
import StyledCheckbox from 'components/UI/StyledCheckbox'
import StyledRadio from 'components/UI/StyledRadio'
import ButtonLoading from 'components/UI/ButtonLoading'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import { AbsentMode } from 'app/enums'

import { OpenAbsentDialog, StudentAbsent } from './recoil'
import sessionHelper from 'utils/sessionHelper'
import { toastState } from 'recoils/atoms'

import { doPost } from 'utils/axios'
import config from 'config'

export const AbsentDialog = () => {
  let theme = useTheme()
  let fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  let [toast, setToast] = useRecoilState(toastState)
  let [absentDialog, setAbsentDialog] = useRecoilState(OpenAbsentDialog)
  let [reason, setReason] = useState('')
  let [hasPermission, setHasPermission] = useState(true)
  let [absentMode, setAbsentMode] = useState([])
  let student = useRecoilValue(StudentAbsent)
  let [loading, setLoading] = useState(false)

  const handleSaveAbsent = async e => {
    e.preventDefault()

    setLoading(true)

    const val = {
      StudentId: student.id,
      DateAbsent: new Date(),
      IsActive: true,
      Mode: 0,
      ScholasticId: sessionHelper().scholasticId,
      UserFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`,
      UserId: sessionHelper().userId,
      ClassId: sessionHelper().classId,
      Reason: reason,
      HasPermission: hasPermission,
      Modes: absentMode
    }

    try {
      var res = await doPost(`${config.ApiEndpoint}/student/absent`, val)
      if (res && res.data.success) {
        setAbsentDialog(false)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setAbsentMode([])
        setReason('')
        setLoading(false)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const handleCheckMode = e => {
    const val = Number(e.target.value)
    const itemExist = absentMode.find(v => v === val)
    if (itemExist) {
      setAbsentMode(absentMode.filter(i => i !== val))
    } else {
      setAbsentMode([...absentMode, val])
    }
  }

  const handleClose = () => {
    if (!loading) {
      setAbsentMode([])
      setReason('')
      setAbsentDialog(false)
    }
  }

  return (
    <Dialog open={absentDialog} onClose={() => setAbsentDialog(false)} aria-labelledby="responsive-dialog-title" fullScreen={fullScreen} maxWidth="lg">
      <DialogTitle>Điểm danh Đoàn sinh</DialogTitle>
      <Divider />
      <DialogContent>
        <CardContent>
          <Grid container spacing={2}>
            <Grid container item xs={12} lg={12}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row className="p-1">
                  <FormControlLabel control={<StyledCheckbox onChange={handleCheckMode} value={AbsentMode.Mass} />} label="Nghỉ lễ" labelPlacement="end" />
                  <FormControlLabel control={<StyledCheckbox onChange={handleCheckMode} value={AbsentMode.Class} />} label="Nghỉ học" labelPlacement="end" />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={12}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row className="p-1">
                  <FormControlLabel
                    onChange={e => setHasPermission(e.target.checked)}
                    checked={hasPermission}
                    control={<StyledRadio color="primary" />}
                    label="Có phép"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    onChange={e => setHasPermission(!e.target.checked)}
                    checked={!hasPermission}
                    control={<StyledRadio color="primary" />}
                    label="Không phép"
                    labelPlacement="end"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={12}>
              <TextField label="Lý do" type="text" variant="outlined" fullWidth value={reason} onChange={e => setReason(e.target.value)} />
            </Grid>
          </Grid>
        </CardContent>
        <DialogActions>
          <Grid container spacing={2}>
            <Grid item xs={6} md={2}>
              <ButtonLoading btnText="Lưu" loading={loading} handleButtonClick={handleSaveAbsent} disabled={absentMode.length === 0} />
            </Grid>
            <Grid item xs={6} md={2}>
              <Button onClick={handleClose} variant="outlined">
                Quay về
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
