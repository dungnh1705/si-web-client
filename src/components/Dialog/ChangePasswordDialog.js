import { CardContent, Dialog, DialogContent, DialogTitle, Typography, DialogActions, Button, Grid, TextField, Divider } from '@material-ui/core'
import React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import { useFormik } from 'formik'
import Yup from 'utils/Yup'

import { doPost } from 'utils/axios'
import config from 'config'
import sessionHelper from 'utils/sessionHelper'
import { toastState, loadingState, ShowChangePassword } from 'recoils/atoms'

export const ChangePasswordDialog = () => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const setLoading = useSetRecoilState(loadingState)
  const [toast, setToast] = useRecoilState(toastState)

  let [open, setOpen] = useRecoilState(ShowChangePassword)

  const useFormValidationFrom = Yup.object({
    CurrentPassword: Yup.string().required('Không được bỏ trống.').max(255),
    NewPassword: Yup.string()
      .required('Không được bỏ trống.')
      .matches(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])[\w!@#$%^&*]{8,32}$/, 'Mật khẩu không đúng định dạng.')
      .max(255),
    ConfirmPass: Yup.string()
      .oneOf([Yup.ref('NewPassword')], 'Phải giống mật khẩu mới.')
      .required('Không được bỏ trống.')
      .max(255)
  })

  const formData = useFormik({
    initialValues: {},
    validationSchema: useFormValidationFrom,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true,
    initialErrors: { CurrentPassword: 'Required' }
  })

  const TextField_Props = (name, label = name, isRequired = false, placeholder = '', maxLength = 255) => {
    const { values, errors, touched, handleBlur, handleChange } = formData
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
    setOpen(false)
    formData.resetForm({ values: {} })
  }

  const handleChangePass = async e => {
    e.preventDefault()
    setLoading(true)
    let oldPassword = formData.values['CurrentPassword']
    let newPassword = formData.values['NewPassword']
    try {
      let res = await doPost(`user/resetPassword`, { userId: sessionHelper().userId, oldPassword: oldPassword, newPassword: newPassword })
      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        handleCloseDialog()
        setLoading(false)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="responsive-roles-dialog" fullScreen={fullScreen} maxWidth="lg">
      <DialogTitle>Thay đổi mật khẩu</DialogTitle>
      <Divider />
      <DialogContent>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField {...TextField_Props('CurrentPassword', 'Mật khẩu hiện tại', false, 'Bắt buộc')} type="password" />
            </Grid>
            <Grid item xs={12}>
              <TextField {...TextField_Props('NewPassword', 'Mật khẩu mới', false, 'Bắt buộc')} type="password" />
            </Grid>
            <Grid item xs={12}>
              <TextField {...TextField_Props('ConfirmPass', 'Nhập lại mật khẩu mới', false, 'Bắt buộc')} type="password" />
            </Grid>
          </Grid>
        </CardContent>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            - Mật khẩu từ 8-32 ký tự.
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            - Mật khẩu phải chứa ký tự in hoa, in thường và phải có ít nhất 1 số.
          </Typography>
        </CardContent>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={handleChangePass} color="primary" variant="contained" disabled={!formData.isValid}>
          Lưu
        </Button>
        <Button size="large" onClick={handleCloseDialog} variant='outlined'>
          Quay về
        </Button>
      </DialogActions>
    </Dialog>
  )
}