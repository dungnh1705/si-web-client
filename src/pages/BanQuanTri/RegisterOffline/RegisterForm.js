import React, { Suspense, useEffect, useState } from 'react'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { Card, CardContent, Grid, TextField, FormControl, FormControlLabel, FormGroup, MenuItem, CardActions, Button, Divider } from '@material-ui/core'
import Yup from 'utils/Yup'
import { useFormik } from 'formik'
import { doPost } from 'utils/axios'

// External
import StyledRadio from 'components/UI/StyledRadio'
import { HolyNameQuery, BranchQuery } from 'recoils/selectors'
import config from 'config'
import sessionHelper from 'utils/sessionHelper'
import { loadingState, toastState } from 'recoils/atoms'
import { ShortTextField, AutocompleteTextField, KeyboardDateField } from 'components/Controls'

// Internal
import { ReloadNewStudent, NewStudentSelected, IsEditNewStu } from './recoil'

let initValue = {
  stuHolyId: 1,
  stuFatherHolyId: 1,
  stuMotherHolyId: 1,
  isIncludeMoreInfo: true,
  stuGender: true
}

const RegisterForm = () => {
  let lstHolyName = useRecoilValue(HolyNameQuery)
  let lstBranch = useRecoilValue(BranchQuery)
  let [toast, setToast] = useRecoilState(toastState)
  let setLoading = useSetRecoilState(loadingState)
  let setReloadStu = useSetRecoilState(ReloadNewStudent)

  let [branchId, setBranchId] = useState('CC')
  let [groupId, setGroupId] = useState('CC-CC')
  let [newStudent, setNewStudent] = useRecoilState(NewStudentSelected)
  let [isEdit, setIsEdit] = useRecoilState(IsEditNewStu)

  useEffect(() => {
    if (newStudent && newStudent.studentClass.length > 0) {
      let stuClass = newStudent.studentClass.find(sl => sl.class.scholasticId == sessionHelper().scholasticId).class
      let gId = stuClass.groupId

      lstBranch.forEach(b => {
        let bg = b.group.find(gp => gp.groupId === gId)
        if (bg) {
          setBranchId(bg.branchId)
          setGroupId(gId)
        }
      })
    }
  }, [newStudent])

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
    initialValues: newStudent
      ? { ...newStudent, ...newStudent.studentMoreInfo, stuBranchId: branchId, stuGroupId: groupId }
      : { ...initValue, stuBranchId: branchId, stuGroupId: groupId },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true,
    initialErrors: { StuFirstName: 'Required' }
  })

  const TextField_Props = (name, label, maxLength) => {
    const { values, errors, touched, handleBlur, handleChange } = stuForm
    return {
      name,
      label,
      fullWidth: true,
      variant: 'outlined',
      error: errors[name] && touched[name],
      helperText: errors[name] && touched[name] && errors[name],
      InputLabelProps: { shrink: true },
      value: values[name] ?? '',
      onBlur: handleBlur,
      onChange: handleChange,
      inputProps: {
        maxLength: maxLength
      }
    }
  }

  const handleClickSave = async e => {
    e.preventDefault()
    setLoading(true)

    let formData = stuForm.values
    if (isEdit) {
      setBranchId('CC')
      setGroupId('CC-CC')

      try {
        var res = await doPost(`${config.ApiEndpoint}/student/updateNewStudentInfo`, { ...formData, UserFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}` })
        if (res && res.data.success) {
          setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
          setReloadStu(reload => reload + 1)
          setIsEdit(false)
          setNewStudent(undefined)
        }
      } catch (err) {
        setToast({ ...toast, open: true, message: err.message, type: 'error' })
      } finally {
        setLoading(false)
      }
    } else {
      setBranchId(formData.stuBranchId)
      setGroupId(formData.stuGroupId)

      try {
        const res = await doPost(`${config.ApiEndpoint}/student/registerStudent`, {
          ...formData,
          UserFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`,
          RegisterMode: 0
        })
        if (res && res.data.success) {
          setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
          setReloadStu(reload => reload + 1)
          stuForm.resetForm({ values: { ...initValue, stuBranchId: branchId, stuGroupId: groupId } })
        }
      } catch (err) {
        setToast({ ...toast, open: true, message: err.message, type: 'error' })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleChangeBranch = e => {
    e.preventDefault()
    stuForm.setFieldValue('stuBranchId', e.target.value)

    const tmp = lstBranch.find(g => g.branchId === e.target.value).group
    stuForm.setFieldValue('stuGroupId', tmp[0].groupId)
  }

  const handleCancel = e => {
    e.preventDefault()

    setIsEdit(false)
    setNewStudent(undefined)
    setBranchId('CC')
    setGroupId('CC-CC')
  }

  return (
    <Suspense fallback={<>Đang tải...</>}>
      <Card className="card-box mb-4 w-100">
        <div className="card-header">
          <div className="card-header--title">
            <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Thông tin Đoàn sinh</h4>
          </div>
        </div>
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField select {...TextField_Props('stuBranchId', 'Ngành')} onChange={handleChangeBranch}>
                  {lstBranch
                    ?.filter(b => b.branchId !== 'NON')
                    .map((branch, i) => (
                      <MenuItem key={branch.branchName} value={branch.branchId}>
                        {branch.branchName}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField select {...TextField_Props('stuGroupId', 'Phân đoàn')}>
                  {lstBranch
                    ?.find(g => g.branchId === stuForm.values['stuBranchId'])
                    ?.group.map((group, i) => (
                      <MenuItem key={`group-${group.groupName}`} value={group.groupId}>
                        {group.groupName}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <AutocompleteTextField formik={stuForm} name="stuHolyId" label="Tên Thánh" options={lstHolyName} />
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
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <KeyboardDateField formik={stuForm} name="stuDob" label="Ngày sinh" />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <ShortTextField formik={stuForm} name="note" label="Ghi chú" />
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <KeyboardDateField formik={stuForm} name="stuBaptismDate" label="Ngày rửa tội" />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <KeyboardDateField formik={stuForm} name="stuEucharistDate" label="Ngày rước lễ" />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <KeyboardDateField formik={stuForm} name="stuConfirmationDate" label="Ngày thêm sức" />
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={9}>
                <ShortTextField formik={stuForm} name="stuAddress" label="Địa chỉ" maxLength={250} />
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <AutocompleteTextField formik={stuForm} name="stuFatherHolyId" label="Tên Thánh" options={lstHolyName} />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <ShortTextField formik={stuForm} name="stuFatherFullName" label="Họ và tên Cha" maxLength={150} />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <ShortTextField formik={stuForm} name="stuFatherPhone" label="Số điện thoại" maxLength={11} />
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <AutocompleteTextField formik={stuForm} name="stuMotherHolyId" label="Tên Thánh" options={lstHolyName} />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <ShortTextField formik={stuForm} name="stuMotherFullName" label="Họ và tên Mẹ" maxLength={150} />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <ShortTextField formik={stuForm} name="stuMotherPhone" label="Số điện thoại" maxLength={11} />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container spacing={2}>
            <Grid container item spacing={2} justifyContent="flex-end" style={{ padding: '16px' }}>
              <Grid item xs={12} sm={6} md={2}>
                <Button color="primary" onClick={handleClickSave} variant="contained" disabled={!stuForm.isValid} fullWidth>
                  LƯU
                </Button>
              </Grid>

              {isEdit && (
                <Grid item xs={12} sm={6} md={2}>
                  <Button onClick={handleCancel} fullWidth variant="outlined">
                    HỦY BỎ
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Suspense>
  )
}

export default RegisterForm
