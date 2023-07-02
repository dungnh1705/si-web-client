import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { Grid, Container, InputAdornment, FormControlLabel, Checkbox, Card, CardContent, FormControl, FormHelperText, Hidden, TextField } from '@material-ui/core'

import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone'
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone'
import projectLogo from 'assets/images/app-logo.png'

import { useFormik } from 'formik'
import Yup from 'utils/Yup'

import { OpenForgotPasswordFormState, OpenRegisterFormState } from './recoil'
import { doPost } from 'utils/axios'
import { saveLoginData, checkSession } from 'utils/sessionHelper'
import { checkLoginToken } from 'utils/sessionHelper'

import Loading from 'layouts/AdminLayout/Loading'
import Toast from 'layouts/AdminLayout/Toast'
import ButtonLoading from 'components/UI/ButtonLoading'
import ForgotPasswordFrom from './forgotPasswordForm'
import Register from './register'

const loginValidationSchema = Yup.object({
  Email: Yup.string().required('Email không được bỏ trống').email('Không đúng định dạng Email'),
  Password: Yup.string().required('Mật khẩu không được bỏ trống')
})

const Login = () => {
  if (checkLoginToken()) {
    window.location.href = '/Dashboard'
  }

  const setOpenForgotPasswordFormState = useSetRecoilState(OpenForgotPasswordFormState)
  const setOpenRegisterForm = useSetRecoilState(OpenRegisterFormState)

  const [loading, setLoading] = useState(false)

  const signInForm = useFormik({
    initialValues: { Email: '', Password: '', RememberMe: false },
    validationSchema: loginValidationSchema,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true
  })

  const TextField_Props = (name, maxLength = 255) => {
    const { values, handleBlur, handleChange } = signInForm
    return {
      name,
      fullWidth: true,
      value: values[name],
      onBlur: handleBlur,
      onChange: handleChange,
      inputProps: {
        maxLength: maxLength
      },
      variant: 'outlined'
    }
  }

  const handleChangeRememberMe = e => {
    signInForm.setFieldValue('RememberMe', e.target.checked)
  }

  const handleSignInClick = e => {
    e.preventDefault()
    setLoading(true)

    signInForm.setFieldTouched('Email', true)
    signInForm.setFieldTouched('Password', true)

    doPost(`auth/login`, signInForm.values)
      .then(async res => {
        if (res.data.success) {
          const { data } = res.data
          saveLoginData(data)

          checkSaveLocalData().then(result => {
            if (result) {
              if (data.isFirstLogin) {
                window.location.href = '/MyProfile'
              } else {
                window.location.href = '/Dashboard'
              }
            }
          })
        } else {
          signInForm.setFieldError('Password', res.data.message)
          setLoading(false)
        }
      })
      .catch(err => {
        setLoading(false)
      })
  }

  const handleForgotPassword = e => {
    e.preventDefault()
    setOpenForgotPasswordFormState(true)
  }

  const handleRegister = e => {
    e.preventDefault()
    setOpenRegisterForm(true)
  }

  const checkSaveLocalData = async () => {
    return setTimeout(() => {
      if (checkSession()) {
        return true
      } else {
        checkSaveLocalData()
      }
    }, 3000)
  }

  return (
    <div className="app-wrapper min-vh-100">
      <div className="app-main flex-column">
        <div className="app-content">
          <div className="app-content--inner d-flex align-items-center" style={{ padding: '1rem' }}>
            <div className="flex-grow-1 w-100 d-flex align-items-center">
              <div className="bg-composed-wrapper--content py-5">
                <Container maxWidth="lg">
                  <Grid container spacing={5} alignItems="center">
                    <Hidden smDown>
                      <Grid item xs={12} md={5} lg={5} className="align-items-center">
                        <img alt="Logo" className="mx-auto d-block img-fluid" src={projectLogo} style={{ filter: 'drop-shadow(0 0 5px blue)', height: '350px', width: '350px' }} />
                      </Grid>
                    </Hidden>
                    <Grid item xs={12} md={7} lg={7} className="d-flex flex-column align-items-center">
                      <span className="w-100 text-left text-md-center pb-4">
                        <h1 className="display-4 text-xl-left text-center mb-3 font-weight-bold">Xứ Đoàn TNTT Thánh Phanxicô Xaviê Gx.Thạch Đà</h1>
                        <p className="font-size-lg text-xl-left text-center mb-0 text-black-50">Hệ thống quản lý thông tin Đoàn sinh</p>
                      </span>
                      <Card className="m-0 w-100 p-0 border-0">
                        <CardContent className="pt-4">
                          <form className="px-2" onSubmit={handleSignInClick}>
                            <div className="mb-2">
                              <FormControl className="w-100" error={signInForm.errors['Email'] && signInForm.touched['Email']}>
                                <TextField
                                  {...TextField_Props('Email')}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <MailOutlineTwoToneIcon />
                                      </InputAdornment>
                                    )
                                  }}
                                  placeholder="Email"
                                />
                                {signInForm.errors['Email'] && signInForm.touched['Email'] && <FormHelperText>{signInForm.errors['Email']}</FormHelperText>}
                              </FormControl>
                            </div>
                            <div className="mb-3">
                              <FormControl className="w-100" error={signInForm.errors['Password'] && signInForm.touched['Password']}>
                                <TextField
                                  {...TextField_Props('Password')}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <LockTwoToneIcon />
                                      </InputAdornment>
                                    )
                                  }}
                                  placeholder="Mật khẩu"
                                  type="password"
                                />
                                {signInForm.errors['Password'] && signInForm.touched['Password'] && <FormHelperText>{signInForm.errors['Password']}</FormHelperText>}
                              </FormControl>
                            </div>
                            <Grid container spacing={1} alignItems="center">
                              <Grid item xs={12} md={6} lg={6}>
                                <FormControlLabel
                                  className="m--2"
                                  control={<Checkbox onChange={handleChangeRememberMe} value={signInForm.values.RememberMe} color="primary" />}
                                  label="Lưu đăng nhập của tôi"
                                />
                              </Grid>
                              <Grid container item xs={12} md={6} lg={6} justifyContent="flex-end">
                                <Grid item>
                                  <i className="text-link" style={{ cursor: 'pointer' }} onClick={handleForgotPassword}>
                                    <u>Quên mật khẩu?</u>
                                  </i>
                                </Grid>
                              </Grid>
                            </Grid>

                            <div className="text-center mt-3">
                              <Grid container item spacing={2} justifyContent="center">
                                <Grid item xs={12} md={4}>
                                  <ButtonLoading
                                    btnText="Đăng nhập"
                                    loading={loading}
                                    disabled={!signInForm.isValid}
                                    className="my-2"
                                    type="submit"
                                    handleButtonClick={handleSignInClick}
                                  />
                                </Grid>
                              </Grid>
                            </div>

                            <div className="w-100 text-center mt-5">
                              <p>Nếu chưa có tài khoản?</p>
                            </div>
                            <div className="w-100 text-center">
                              <p className="text-link" style={{ cursor: 'pointer' }} onClick={handleRegister}>
                                <u>Đăng ký tại đây</u>
                              </p>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Container>

                <ForgotPasswordFrom />
                <Register />
                <Toast />
                <Loading />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login
