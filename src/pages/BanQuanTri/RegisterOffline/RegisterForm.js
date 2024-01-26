import React, { Suspense, useEffect, useState } from 'react'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import { Card, CardContent, Grid, TextField, FormControl, FormControlLabel, FormGroup, MenuItem, CardActions, Button, Divider } from '@material-ui/core'

// 3party
import { get } from 'lodash'
import Yup from 'utils/Yup'
import { useFormik } from 'formik'
import sessionHelper from 'utils/sessionHelper'
import { doPost } from 'utils/axios'

// External
import StyledRadio from 'components/UI/StyledRadio'
import { ShortTextField, AutocompleteTextField, KeyboardDateField } from 'components/Controls'
import { HolyNameQuery, BranchQuery, UnionRegisterQuery } from 'recoils/selectors'
import { loadingState, toastState } from 'recoils/atoms'

// Internal
import { ReloadNewStudent, NewStudentSelected, IsEditNewStu } from './recoil'

const initValue = {
  stuHolyId: 1,
  stuFatherHolyId: 1,
  stuMotherHolyId: 1,
  isIncludeMoreInfo: true,
  stuGender: true
}

const RegisterForm = () => {
  const [branchId, setBranchId] = useState('CC')
  const [groupId, setGroupId] = useState('CC-CC')

  const [toast, setToast] = useRecoilState(toastState)
  const [newStudent, setNewStudent] = useRecoilState(NewStudentSelected)
  const [isEdit, setIsEdit] = useRecoilState(IsEditNewStu)

  const lstHolyName = useRecoilValue(HolyNameQuery)
  const lstBranch = useRecoilValue(BranchQuery)
  const lstUnion = useRecoilValue(UnionRegisterQuery(groupId))

  const setLoading = useSetRecoilState(loadingState)
  const setReloadStu = useSetRecoilState(ReloadNewStudent)

  useEffect(() => {
    if (newStudent && newStudent.studentClass.length > 0) {
      const stuClass = newStudent.studentClass.find(sl => Number(sl.class.scholasticId) === Number(sessionHelper().scholasticId)).class
      const gId = stuClass.groupId

      lstBranch.forEach(b => {
        const bg = b.group.find(gp => gp.groupId === gId)
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
        const res = await doPost(`student/updateNewStudentInfo`, {
          ...formData,
          UserFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`
        })
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
        const res = await doPost(`student/registerStudent`, {
          ...formData,
          UserFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`,
          RegisterMode: 0
        })
        if (res && res.data.success) {
          setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
          setReloadStu(reload => reload + 1)
          stuForm.resetForm({
            values: {
              ...initValue,
              stuBranchId: branchId,
              stuGroupId: groupId,
              stuUnionId: formData.stuUnionId,
              stuTeamCode: formData.stuTeamCode
            }
          })
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

  useEffect(() => {
    if (get(stuForm.values, 'stuGroupId') !== 'CC-CC') {
      stuForm.setFieldValue('stuUnionId', undefined)
      stuForm.setFieldValue('stuTeamCode', undefined)
    }
  }, [get(stuForm.values, 'stuGroupId')])

  console.log('stuForm',stuForm.values)
  return (
    <Suspense fallback={<>Đang tải...</>}>
      <Card className="card-box mb-4 w-100">
        <div className="card-header">
          <div className="card-header--title">
            <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Thêm mới Đoàn sinh</h4>
          </div>
        </div>
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {/* Thông tin về Phân Đoàn */}
            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <b>Thông tin quản lý</b>
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
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
              {get(stuForm.values, 'stuGroupId') === 'CC-CC' && (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField select {...TextField_Props('stuUnionId', 'Chi đoàn')}>
                      {lstUnion?.map(union => (
                        <MenuItem key={`union-${union.unionId}`} value={union.unionId}>
                          {union.unionCode}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField select {...TextField_Props('stuTeamCode', 'Đội')}>
                      {Array.from(Array(lstUnion.find(u => Number(u.unionId) === Number(get(stuForm.values, 'stuUnionId')))?.totalTeam).keys()).map(team => (
                        <MenuItem key={`team-${team}`} value={team + 1}>
                          {team + 1}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </>
              )}
            </Grid>

            <Grid container item spacing={2} className="mt-2">
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <b>Thông tin Đoàn sinh</b>
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <AutocompleteTextField formik={stuForm} name="stuHolyId" label="Tên Thánh" options={lstHolyName} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ShortTextField formik={stuForm} name="stuFirstName" label="Họ và đệm" required autoCapitalize maxLength={100} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ShortTextField formik={stuForm} name="stuLastName" label="Tên" required autoCapitalize maxLength={50} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
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
        <CardActions>
          <Grid container spacing={2}>
            <Grid container item spacing={2} justifyContent="flex-end" style={{ padding: '16px' }}>
              <Grid item xs={12} sm={6} md={2}>
                <Button size="large" color="primary" onClick={handleClickSave} variant="contained" disabled={!stuForm.isValid} fullWidth>
                  LƯU
                </Button>
              </Grid>

              {isEdit && (
                <Grid item xs={12} sm={6} md={2}>
                  <Button size="large" onClick={handleCancel} fullWidth variant="outlined">
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
