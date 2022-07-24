import React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Button, TextField, Grid, Divider, CardContent, Typography, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone'
import { useFormik } from 'formik'
import Yup from 'utils/Yup'
import config from 'config'

import { loadingState, toastState } from 'recoils/atoms'
import { doGet } from 'utils/axios'

import { OpenForgotPasswordFormState } from './recoil'

const ForgotPasswordFrom = () => {
  const [openForgotPasswordFrom, setOpenForgotPasswordFrom] = useRecoilState(OpenForgotPasswordFormState)
  const [toast, setToast] = useRecoilState(toastState)

  const setLoading = useSetRecoilState(loadingState)

  const validationSchema = Yup.object({
    Email: Yup.string().required('Bắt buộc nhập Email').max(255).email('Email không đúng định dạng')
  })

  const formData = useFormik({
    initialValues: {},
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true,
    initialErrors: { Email: 'Required' }
  })

  const TextField_Props = (name, label = name, maxLength = 255) => {
    const { values, errors, touched, handleBlur, handleChange } = formData
    return {
      name,
      label,
      fullWidth: true,
      error: errors[name] && touched[name],
      helperText: errors[name] && touched[name] && errors[name],
      InputLabelProps: { shrink: true },
      value: values[name],
      onBlur: handleBlur,
      onChange: handleChange,
      inputProps: {
        maxLength: maxLength
      },
      variant: 'outlined'
    }
  }

  const handleClickSend = e => {
    e.preventDefault()

    const data = formData.values
    setLoading(true)

    doGet(`${config.ApiEndpoint}/user/forgotPassword`, { email: data['Email'] })
      .then(res => {
        if (res && res.data && res.data.success) {
          setToast({ ...toast, open: true, message: res.data.message, title: 'Success!', type: 'success' })
          closeForgotFrom()
        } else {
          formData.setFieldError('Email', res.data.message)
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false)
      })
  }

  const closeForgotFrom = () => {
    formData.resetForm({ initialValues: {}, validateOnMount: true })
    setOpenForgotPasswordFrom(false)
  }

  return (
    <Dialog open={openForgotPasswordFrom} onClose={closeForgotFrom}>
      <DialogTitle>LẤY LẠI MẬT KHẨU</DialogTitle>
      <Divider />
      <DialogContent style={{ padding: '8px 16px' }}>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            - Nhập địa chỉ Email của bạn dùng để đăng nhập hệ thống.
            <br />- Chúng tôi sẽ gửi một email tới bạn để hướng dẫn thay đổi mật khẩu.
          </Typography>
        </CardContent>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                {...TextField_Props('Email', '')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                placeholder="Email"
              />
            </Grid>
          </Grid>
        </CardContent>
      </DialogContent>
      <DialogActions style={{ padding: '32px' }}>
        <Grid container item spacing={2} justifyContent="center">
          <Grid item xs={6}>
            <Button size="large" color="primary" onClick={handleClickSend} variant="contained" disabled={!formData.isValid} fullWidth>
              Gửi
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button size="large" onClick={closeForgotFrom} variant="outlined" fullWidth>
              Hủy bỏ
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default ForgotPasswordFrom
