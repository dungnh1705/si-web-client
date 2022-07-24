import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import { Grid, Container, Input, InputLabel, InputAdornment, Card, CardContent, FormControl, FormHelperText } from '@material-ui/core'
import SuspenseLoading from 'components/SuspenseLoading'
import ButtonLoading from 'components/UI/ButtonLoading'
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone'
import svgImage9 from 'assets/images/illustrations/login.svg'

import { useFormik } from 'formik'
import Yup from 'utils/Yup'

import config from 'config'
import { history } from 'App'
import { saveLoginData } from 'utils/sessionHelper'
import { doGet, doPost } from 'utils/axios'

import { toastState } from 'recoils/atoms'

const ResetPassword = () => {
  const { token } = useParams()
  const [loadingPage, setLoadingPage] = useState(true)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useRecoilState(toastState)

  const validationSchema = Yup.object({
    Password: Yup.string()
      .required('Bắt buộc nhập Mật khẩu')
      .matches(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])[\w!@#$%^&*]{8,32}$/, 'Mật khẩu không đúng định dạng.')
      .max(255),
    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref('Password')], 'Không trùng khớp')
      .required('Không được bỏ trống.')
      .max(255)
  })

  const resetForm = useFormik({
    initialValues: { Password: '', ConfirmPass: '' },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true
  })

  useEffect(() => {
    async function fetchData() {
      setLoadingPage(true)

      try {
        let res = await doGet(`auth/validateCodeResetPassword`, { code: token })

        if (!res.data.success) {
          history.push('/errors/error-404')
        }
      } catch (err) {
        history.push('/errors/error-404')
      } finally {
        setLoadingPage(false)
      }
    }

    fetchData() // componentWillUnmount
    return () => {
      setLoadingPage(null)
    }
  }, [])

  const TextField_Props = (name, required = false, placeholder = '', maxLength = 255) => {
    const { values, handleBlur, handleChange } = resetForm
    return {
      name,
      fullWidth: true,
      value: values[name],
      onBlur: handleBlur,
      onChange: handleChange,
      required: required,
      inputProps: {
        maxLength: maxLength
      },
      placeholder: placeholder
    }
  }

  const handleResetClick = async e => {
    e.preventDefault()
    setLoading(true)
    let data = resetForm.values

    try {
      let res = await doPost(`auth/resetNewPassword`, { uniqueCode: token, password: data.Password })

      if (res && res.data.success) {
        let { data } = res.data
        saveLoginData(data)

        if (data.isFirstLogin) {
          window.location.href = '/MyProfile'
        } else {
          window.location.href = '/Dashboard'
        }
      } else {
        setToast({ ...toast, open: true, message: res.data.message, type: 'error' })
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const template = () => {
    return (
      <>
        <div className="app-wrapper min-vh-100">
          <div className="app-main flex-column">
            <div className="app-content">
              <div className="app-content--inner d-flex align-items-center" style={{ padding: '1rem' }}>
                <div className="flex-grow-1 w-100 d-flex align-items-center">
                  <div className="bg-composed-wrapper--content py-5">
                    <Container maxWidth="lg">
                      <Grid container spacing={5}>
                        <Grid item xs={12} lg={5} className="d-none d-xl-flex align-items-center">
                          <img alt="..." className="w-100 mx-auto d-block img-fluid" src={svgImage9} />
                        </Grid>
                        <Grid item xs={12} lg={7} className="d-flex flex-column align-items-center">
                          <span className="w-100 text-left text-md-center pb-4">
                            <h1 className="display-4 text-xl-left text-center mb-3 font-weight-bold">Đoàn TNTT Ngôi Ba Thiên Chúa Gx.Thạch Đà</h1>
                            <p className="font-size-lg text-xl-left text-center mb-3 text-black-50">Hãy nhập mật khẩu mới để đăng nhập hệ thống</p>
                            <p className="font-size-lg text-xl-left mb-0" style={{ color: '#263055', fontSize: '14px' }}>
                              - Mật khẩu từ 8-32 ký tự.
                              <br />- Mật khẩu phải chứa ký tự in hoa, in thường và phải có ít nhất 1 số.
                            </p>
                          </span>
                          <Card className="m-0 w-100 p-0 border-0">
                            <CardContent className="p-0">
                              <form className="px-5">
                                <div className="mb-3">
                                  <FormControl className="w-100" error={resetForm.errors['Password'] && resetForm.touched['Password']}>
                                    <InputLabel htmlFor="input-with-icon-adornment"></InputLabel>
                                    <Input
                                      {...TextField_Props('Password', true, 'Mật khẩu mới ')}
                                      type="password"
                                      fullWidth
                                      startAdornment={
                                        <InputAdornment position="start">
                                          <LockTwoToneIcon />
                                        </InputAdornment>
                                      }
                                    />
                                    {resetForm.errors['Password'] && resetForm.touched['Password'] && <FormHelperText>{resetForm.errors['Password']}</FormHelperText>}
                                  </FormControl>
                                </div>
                                <div className="mb-3">
                                  <FormControl className="w-100" error={resetForm.errors['ConfirmPassword'] && resetForm.touched['ConfirmPassword']}>
                                    <InputLabel htmlFor="standard-adornment-password"></InputLabel>
                                    <Input
                                      {...TextField_Props('ConfirmPassword', true, 'Lập lại mật khẩu mới')}
                                      type="password"
                                      startAdornment={
                                        <InputAdornment position="start">
                                          <LockTwoToneIcon />
                                        </InputAdornment>
                                      }
                                    />
                                    {resetForm.errors['ConfirmPassword'] && resetForm.touched['ConfirmPassword'] && (
                                      <FormHelperText>{resetForm.errors['ConfirmPassword']}</FormHelperText>
                                    )}
                                  </FormControl>
                                </div>

                                <div className="text-center">
                                  <ButtonLoading
                                    btnText="Đăng nhập"
                                    loading={loading}
                                    disabled={!resetForm.isValid}
                                    className="my-2"
                                    type="submit"
                                    handleButtonClick={handleResetClick}
                                  />
                                </div>
                              </form>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (loadingPage) return <SuspenseLoading />
  return template()
}

export default ResetPassword
