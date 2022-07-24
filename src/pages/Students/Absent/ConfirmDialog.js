import { Dialog, DialogContent, InputAdornment, DialogTitle, Button, DialogActions, Typography, TextField, Divider, Grid } from '@material-ui/core'
import React, { useState } from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons'

// External
import ButtonLoading from 'components/UI/ButtonLoading'
import config from 'config'
import { doPost } from 'utils/axios'
import { toastState } from 'recoils/atoms'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { HolyNameQuery } from 'recoils/selectors'

// Internal
import { ShowConfirmDialog, AbsentSelected, ReloadStudentAbsent } from './recoil'

const ConfirmDialog = () => {
  let [loading, setLoading] = useState(false)
  let [toast, setToast] = useRecoilState(toastState)

  let [open, setOpen] = useRecoilState(ShowConfirmDialog)
  let lstHolyName = useRecoilValue(HolyNameQuery)
  let absent = useRecoilValue(AbsentSelected)

  let setReload = useSetRecoilState(ReloadStudentAbsent)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOk = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      let res = await doPost(`${config.ApiEndpoint}/student/absent`, { ...absent, mode: 3 })

      if (res && res.data.success) {
        setLoading(false)
        setOpen(false)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setReload(reload => reload + 1)
      }
    } catch (err) {
      setLoading(false)
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Xóa ngày nghỉ</DialogTitle>
      <Divider />
      <DialogContent style={{ padding: '20px 10px' }}>
        <TextField
          label="Đoàn sinh"
          fullWidth
          variant="outlined"
          value={`${lstHolyName?.find(h => h.id === absent?.student?.stuHolyId)?.name} ${absent?.student?.stuFirstName} ${absent?.student?.stuLastName}`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faUser} />
              </InputAdornment>
            )
          }}
        />
        <br />
        <br />
        <TextField
          label="Ngày nghỉ"
          fullWidth
          variant="outlined"
          value={`${moment(absent?.dateAbsent).format('DD-MM-YYYY')}`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </InputAdornment>
            )
          }}
        />
        <br />
        <br />
        <Typography variant="h6" color="error">
          BẠN CÓ CHẮC CHẮN MUỐN XÓA KHÔNG?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Grid container item spacing={2} justifyContent="flex-end">
          <Grid item xs={6}>
            <ButtonLoading btnText="Đồng ý" loading={loading} handleButtonClick={handleOk} />
          </Grid>
          <Grid item xs={6}>
            <Button onClick={handleClose} variant="outlined" fullWidth>
              Hủy bỏ
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
