import React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { ChangeUserPasswordDialogAtom } from './recoil'
import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Yup from 'utils/Yup'
import { useFormik } from 'formik'
import { loadingState, toastState } from 'recoils/atoms'
import { doPost } from 'utils/axios'

export default function ChangeUserPasswordDialog() {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const setLoading = useSetRecoilState(loadingState)
  const [toast, setToast] = useRecoilState(toastState)
  const [dialog, setDialog] = useRecoilState(ChangeUserPasswordDialogAtom)
  const { open, info } = dialog

  const useFormValidationFrom = Yup.object({
    NewPassword: Yup.string().required('Không được bỏ trống.').min(6).max(255),
    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref('NewPassword')], 'Phải giống mật khẩu mới.')
      .required('Không được bỏ trống.')
      .min(6)
      .max(255)
  })

  const changePasswordForm = useFormik({
    initialValues: { userId: info?.id, email: info?.email, NewPassword: '', ConfirmPassword: '' },
    validationSchema: useFormValidationFrom,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true,
    initialErrors: {}
  })

  const TextField_Props = (name, label = name, isRequired = false, placeholder = '', maxLength = 255) => {
    const { values, errors, touched, handleBlur, handleChange } = changePasswordForm
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
    changePasswordForm.resetForm({ values: {} })
  }

  const handleChangePassword = async () => {
    setLoading(true)

    const newPassword = changePasswordForm.values['NewPassword']
    const userId = changePasswordForm.values['userId']

    try {
      const res = await doPost(`user/forceChangePassword`, { userId, newPassword })
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
      <DialogTitle>Thay đổi mật khẩu</DialogTitle>
      <Divider />
      <DialogContent>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField {...TextField_Props('email', 'Email đăng nhập')} type="text" disabled={true} />
            </Grid>
            <Grid item xs={12}>
              <TextField {...TextField_Props('NewPassword', 'Mật khẩu mới', true, 'Bắt buộc')} type="password" />
            </Grid>
            <Grid item xs={12}>
              <TextField {...TextField_Props('ConfirmPassword', 'Nhập lại mật khẩu mới', true, 'Bắt buộc')} type="password" />
            </Grid>
          </Grid>
        </CardContent>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={handleChangePassword} color="primary" variant="contained" disabled={!changePasswordForm.isValid}>
          Thay đổi
        </Button>
        <Button size="large" onClick={handleCloseDialog} variant="outlined">
          Quay về
        </Button>
      </DialogActions>
    </Dialog>
  )
}
