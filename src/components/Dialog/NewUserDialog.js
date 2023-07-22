import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Dialog, DialogTitle, Divider, DialogContent, Button, DialogActions, CardContent, Grid } from '@material-ui/core'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { NewUserDialogAtom } from './recoil'
import Yup from 'utils/Yup'
import { useFormik } from 'formik'
import { ShortTextField } from '../Controls'
import { loadingState, toastState } from 'recoils/atoms'
import { doPost } from '../../utils/axios'
import sessionHelper from '../../utils/sessionHelper'

export default function NewUserDialog({ reloadUserList }) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [dialog, setDialog] = useRecoilState(NewUserDialogAtom)
  const { open } = dialog

  const setLoading = useSetRecoilState(loadingState)
  const [toast, setToast] = useRecoilState(toastState)

  const registerFormValidationFrom = Yup.object({
    email: Yup.string().required('Không được bỏ trống').max(255).email('Email không đúng định dạng'),
    firstName: Yup.string().required('Không được bỏ trống').max(150),
    lastName: Yup.string().required('Không được bỏ trống').max(100)
  })

  const registerForm = useFormik({
    initialValues: {},
    validationSchema: registerFormValidationFrom,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true
  })

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
    registerForm.resetForm()
  }

  const handleCreateUser = async () => {
    setLoading(true)

    const val = registerForm.values
    try {
      const res = await doPost(`user/create`, val)
      if (res && res.data.success) {
        setLoading(false)
        handleCloseDialog()
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        reloadUserList()
      } else {
        setLoading(false)
        setToast({ ...toast, open: true, message: res.data.message, type: 'error' })
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="responsive-roles-dialog" fullScreen={fullScreen} maxWidth="sm">
      <DialogTitle>Thêm mới</DialogTitle>
      <Divider />
      <DialogContent>
        <CardContent>
          <Grid container spacing={2} justifyContent={'flex-start'} alignItems={'center'}>
            <Grid item xs={12}>
              <ShortTextField formik={registerForm} name="email" label="Email" maxLength={250} required />
            </Grid>
            <Grid item xs={12}>
              <ShortTextField formik={registerForm} name="firstName" label="Họ và đệm" maxLength={150} required />
            </Grid>
            <Grid item xs={12}>
              <ShortTextField formik={registerForm} name="lastName" label="Tên" maxLength={100} required />
            </Grid>
          </Grid>
        </CardContent>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={handleCreateUser} color="primary" variant="contained" disabled={!registerForm.isValid}>
          Thêm mới
        </Button>
        <Button size="large" onClick={handleCloseDialog} variant="outlined">
          Quay về
        </Button>
      </DialogActions>
    </Dialog>
  )
}
