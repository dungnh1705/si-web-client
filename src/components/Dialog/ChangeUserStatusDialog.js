import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, Grid, TextField } from '@material-ui/core'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { loadingState, toastState } from 'recoils/atoms'
import { ChangeUserStatusDialogAtom } from './recoil'
import Yup from 'utils/Yup'
import { useFormik } from 'formik'
import { doPost } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import StyledRadio from 'components/UI/StyledRadio'
import { UserStatus } from 'app/enums'

export default function ChangeUserStatusDialog() {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const setLoading = useSetRecoilState(loadingState)
  const [toast, setToast] = useRecoilState(toastState)
  const [dialog, setDialog] = useRecoilState(ChangeUserStatusDialogAtom)
  const { open, info } = dialog

  const useFormValidationFrom = Yup.object()

  const changeStatusForm = useFormik({
    initialValues: { id: info?.id, status: info?.status, note: info?.note },
    validationSchema: useFormValidationFrom,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true,
    initialErrors: {}
  })

  const TextField_Props = (name, label = name, isRequired = false, placeholder = '', maxLength = 255) => {
    const { values, errors, touched, handleBlur, handleChange } = changeStatusForm
    return {
      name,
      label,
      fullWidth: true,
      variant: 'outlined',
      error: errors[name] && touched[name],
      helperText: errors[name] && touched[name] && errors[name],
      InputLabelProps: { shrink: true },
      value: values[name],
      onBlur: handleBlur,
      onChange: handleChange,
      required: isRequired,
      inputProps: {
        maxLength: maxLength
      },
      placeholder: placeholder
    }
  }

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false, info: undefined })
    changeStatusForm.resetForm({ values: {} })
  }

  const handleChangeStatus = async () => {
    setLoading(true)

    const values = changeStatusForm.values
    const updatedBy = sessionHelper().fullName

    try {
      const res = await doPost(`user/statusUpdate`, { ...values, updatedBy })
      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        handleCloseDialog()
      } else {
        setToast({ ...toast, open: true, message: res.data.message, type: 'error' })
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="responsive-roles-dialog" fullScreen={fullScreen} maxWidth="md">
      <DialogTitle>Thay đổi trạng thái</DialogTitle>
      <Divider />
      <DialogContent>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row className="p-1">
                  <FormControlLabel
                    onChange={e => changeStatusForm.setFieldValue('status', UserStatus.Active)}
                    checked={changeStatusForm.values['status'] === UserStatus.Active}
                    control={<StyledRadio color="primary" />}
                    label="Đang hoạt động"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    onChange={e => changeStatusForm.setFieldValue('status', UserStatus.Absent)}
                    checked={changeStatusForm.values['status'] === UserStatus.Absent}
                    control={<StyledRadio color="primary" />}
                    label="Nghỉ luôn"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    onChange={e => changeStatusForm.setFieldValue('status', UserStatus.Deleted)}
                    checked={changeStatusForm.values['status'] === UserStatus.Deleted}
                    control={<StyledRadio color="primary" />}
                    label="Xóa"
                    labelPlacement="end"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField {...TextField_Props('note', 'Ghi chú')} type="text" />
            </Grid>
          </Grid>
        </CardContent>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={handleChangeStatus} color="primary" variant="contained">
          Thay đổi
        </Button>
        <Button size="large" onClick={handleCloseDialog} variant="outlined">
          Quay về
        </Button>
      </DialogActions>
    </Dialog>
  )
}
