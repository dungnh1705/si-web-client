import React from 'react'
import { InputAdornment, Grid, Divider, CardContent, TextField, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import { useRecoilState, useSetRecoilState } from 'recoil'

// components
import { useFormik } from 'formik'
import Yup from 'utils/Yup'

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'

import { doPost } from 'utils/axios'
import config from 'config'
import { OpenRegisterFormState } from './recoil'
import { loadingState, toastState } from 'recoils/atoms'
import { useState } from 'react'

const Register = () => {
  const [errorMessage, setErrorMessage] = useState()
  const [openFrom, setOpenFrom] = useRecoilState(OpenRegisterFormState)
  const [toast, setToast] = useRecoilState(toastState)

  const setLoading = useSetRecoilState(loadingState)

  const validationSchema = Yup.object({
    Uniquecode: Yup.string().required('Bắt buộc nhập Mã đăng ký'),
    Email: Yup.string().required('Bắt buộc nhập Email').max(255).email('Email không đúng định dạng'),
    Password: Yup.string()
      .required('Bắt buộc nhập Mật khẩu')
      .matches(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])[\w!@#$%^&*]{8,32}$/, 'Mật khẩu không đúng định dạng.')
      .max(255),
    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref('Password')], 'Không trùng khớp')
      .required('Không được bỏ trống.')
      .max(255)
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

  const handleRegister = async e => {
    e.preventDefault()

    const data = formData.values
    setLoading(true)

    try {
      const response = await doPost(`${config.ApiEndpoint}/auth/register`, data)

      if (response && response.data.success) {
        setToast({ ...toast, open: true, message: response.data.message, title: 'Success!', type: 'success' })
        closeFrom(e)
      } else {
        setErrorMessage(response.data.message)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, title: 'Error', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const closeFrom = e => {
    e.preventDefault()

    setErrorMessage(undefined)
    setOpenFrom(false)
    formData.resetForm({})
  }

  return (
    <Dialog open={openFrom} onClose={closeFrom}>
      <DialogTitle>ĐĂNG KÝ TÀI KHOẢN MỚI</DialogTitle>
      <Divider />
      <DialogContent style={{ padding: '8px 16px' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                {...TextField_Props('Uniquecode', '')}
                InputProps={{
                  maxLength: 150,
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faKey} />
                    </InputAdornment>
                  )
                }}
                placeholder="Mã đăng ký"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...TextField_Props('Email', '')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </InputAdornment>
                  )
                }}
                placeholder="Email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...TextField_Props('Password', '')}
                InputProps={{
                  maxLength: 150,
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faLock} />
                    </InputAdornment>
                  )
                }}
                type="password"
                placeholder="Mật khẩu"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...TextField_Props('ConfirmPassword', '')}
                InputProps={{
                  maxLength: 150,
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faLock} />
                    </InputAdornment>
                  )
                }}
                type="password"
                placeholder="Nhập lại mật khẩu"
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardContent>
          <Typography variant="body2" color="error" component="p">
            {errorMessage}
          </Typography>
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
      <DialogActions style={{ padding: '32px' }}>
        <Grid container item spacing={2} justifyContent="center">
          <Grid item xs={6}>
            <Button size="large" color="primary" onClick={handleRegister} variant="contained" disabled={!formData.isValid} fullWidth>
              Đăng ký
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button size="large" onClick={closeFrom} fullWidth variant="outlined">
              Hủy bỏ
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

export default Register
