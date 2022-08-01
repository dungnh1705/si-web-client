import React from 'react'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { Card, CardContent, Grid, FormControl, FormControlLabel, FormGroup, CardActions, Button, Divider } from '@material-ui/core'

import { useFormik } from 'formik'
import config from 'config'
import { doPost } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import Yup from 'utils/Yup'
import StyledRadio from 'components/UI/StyledRadio'
import { RegisterMode } from 'app/enums'

import { HolyNameQuery } from 'recoils/selectors'
import { loadingState, toastState } from 'recoils/atoms'
import ShortTextField from 'components/Controls/ShortTextField'
import AutocompleteTextField from 'components/Controls/AutocompleteTextField'
import KeyboardDateField from 'components/Controls/KeyboardDateField'

import { ReloadStudentGroup } from 'pages/PhanDoanTruong/ManageStudentsGroup/recoil'

const initValue = {
  stuHolyId: 1,
  isIncludeMoreInfo: false,
  stuGender: true,
  stuFatherHolyId: 1,
  stuMotherHolyId: 1
}

const RegisterForm = () => {
  const lstHolyName = useRecoilValue(HolyNameQuery)
  const [toast, setToast] = useRecoilState(toastState)

  const setLoading = useSetRecoilState(loadingState)
  const setReloadStudent = useSetRecoilState(ReloadStudentGroup)

  const validationSchema = Yup.object({
    stuFirstName: Yup.string().required('Không để trống').max(100, 'Không nhập nhiều hơn 100 ký tự.'),
    stuLastName: Yup.string().required('Không để trống').max(50, 'Không nhập nhiều hơn 50 ký tự.'),
    stuNote: Yup.string().max(250, 'Không nhập nhiều hơn 250 ký tự.').nullable(),
    stuMotherFullName: Yup.string().max(150, 'Không nhập nhiều hơn 150 ký tự.').nullable(),
    stuFatherFullName: Yup.string().max(150, 'Không nhập nhiều hơn 150 ký tự.').nullable(),
    stuMotherPhone: Yup.string()
      .max(11, 'Không nhập nhiều hơn 11 ký tự.')
      .matches(/^[0-9]+$/g, {
        message: 'Không đúng định dạng',
        excludeEmptyString: true
      })
      .nullable(),
    stuFatherPhone: Yup.string()
      .max(11, 'Không nhập nhiều hơn 11 ký tự.')
      .matches(/^[0-9]+$/g, {
        message: 'Không đúng định dạng',
        excludeEmptyString: true
      })
      .nullable()
  })

  const stuForm = useFormik({
    initialValues: { ...initValue },
    validationSchema: validationSchema,
    validateOnChange: true,
    enableReinitialize: true,
    initialErrors: { stuFirstName: 'Required' }
  })

  const handleClickSave = async e => {
    e.preventDefault()
    setLoading(true)

    const formData = stuForm.values

    try {
      var res = await doPost(`student/registerStudent`, {
        ...formData,
        UserFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`,
        RegisterMode: RegisterMode.Offline,
        IsFromLeadOfGroup: true,
        UserId: sessionHelper().userId,
        ScholasticId: sessionHelper().scholasticId
      })
      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setReloadStudent(old => old + 1)
        stuForm.resetForm({ values: { ...initValue } })
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleClearForm = () => {
    stuForm.resetForm({ values: { ...initValue } })
  }

  return (
    <Card className="card-box mb-4 w-100">
      <div className="card-header">
        <div className="card-header--title">
          <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Thông tin Đoàn sinh mới</h4>
        </div>
      </div>
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <AutocompleteTextField options={lstHolyName} formik={stuForm} name="stuHolyId" label="Tên Thánh" />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <ShortTextField formik={stuForm} name="stuFirstName" label="Họ và đệm" required autoCapitalize maxLength={100} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <ShortTextField formik={stuForm} name="stuLastName" label="Tên" required autoCapitalize maxLength={50} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row className="p-1">
                  <FormControlLabel
                    onChange={e => stuForm.setFieldValue('stuGender', e.target.checked)}
                    checked={stuForm.values['stuGender']}
                    control={<StyledRadio color="primary" />}
                    label="Nam"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    onChange={e => stuForm.setFieldValue('stuGender', !e.target.checked)}
                    checked={!stuForm.values['stuGender']}
                    control={<StyledRadio color="primary" />}
                    label="Nữ"
                    labelPlacement="end"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <KeyboardDateField formik={stuForm} name="stuDob" label="Ngày sinh" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuBornIn" label="Sinh tại" />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <KeyboardDateField formik={stuForm} name="stuBaptismDate" label="Rửa Tội ngày" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuBaptismBy" label="Do Linh Mục" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuBaptismIn" label="Tại" />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <KeyboardDateField formik={stuForm} name="stuEucharistDate" label="Rước lễ Lần đầu ngày" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuEucharistIn" label="Tại" />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <KeyboardDateField formik={stuForm} name="stuConfirmationDate" label="Thêm sức ngày" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuConfirmationIn" label="Tại" />
            </Grid>
          </Grid>

          <Grid container item spacing={2} className="mt-2">
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                  <b>Thông tin Cha Mẹ Đoàn sinh</b>
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <AutocompleteTextField formik={stuForm} name="stuFatherHolyId" label="Tên Thánh" options={lstHolyName} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuFatherFullName" label="Họ và tên Cha" maxLength={150} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuFatherDob" label="Năm sinh" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuFatherPhone" label="Số điện thoại" maxLength={11} />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <AutocompleteTextField formik={stuForm} name="stuMotherHolyId" label="Tên Thánh" options={lstHolyName} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuMotherFullName" label="Họ và tên Mẹ" maxLength={150} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuMotherDob" label="Năm sinh" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuMotherPhone" label="Số điện thoại" maxLength={11} />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <ShortTextField formik={stuForm} name="stuAddress" label="Địa chỉ" maxLength={250} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuArea" label="Giáo Khu/Họ" maxLength={100} />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <ShortTextField formik={stuForm} name="stuOldClass" label="Đã học lớp Giáo Lý" maxLength={100} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={stuForm} name="stuOldClassIn" label="Tại Giáo xứ" maxLength={100} />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <ShortTextField formik={stuForm} name="note" label="Lưu ý về Đoàn sinh" />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions style={{ padding: '8px 16px' }}>
        <Grid container item spacing={2} justifyContent="flex-end">
          <Grid item xs={6} sm={3} lg={2}>
            <Button size="large" color="default" onClick={handleClearForm} variant="outlined" fullWidth>
              Nhập lại
            </Button>
          </Grid>
          <Grid item xs={6} sm={3} lg={2}>
            <Button size="large" color="primary" onClick={handleClickSave} variant="contained" fullWidth disabled={!stuForm.isValid}>
              Lưu
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  )
}

export default RegisterForm
