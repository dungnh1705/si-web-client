import React, { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import { Grid, Avatar, InputAdornment, FormControl, Box, FormGroup, FormControlLabel, Radio, CardContent, Button, TextField } from '@material-ui/core'
import Yup from 'utils/Yup'
import { useFormik } from 'formik'
import moment from 'moment'

import Badge from 'components/UI/Badge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBirthdayCake,
  faHandHoldingWater,
  faPrayingHands,
  faHands,
  faBarcode,
  faUserTie,
  faHome,
  faStickyNote,
  faMale,
  faPhoneAlt,
  faFemale
} from '@fortawesome/free-solid-svg-icons'
import { KeyboardDatePicker } from '@material-ui/pickers'

import { StudentStatus, Roles, TemplateType } from 'app/enums'
import InlineTextField from 'components/Controls/InlineTextField'
import { PhoneCallDialogAtom, DocumentPreviewDialogAtom } from 'components/Dialog/recoil'

import { HolyNameQuery } from 'recoils/selectors'
import { toastState } from 'recoils/atoms'
import { doPost } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'

import HolyName from './HolyName'
import { ReloadStuSearch, GetStudentDetails } from './recoil'

const StudentInfo = ({ tabValue }) => {
  const student = useRecoilValue(GetStudentDetails)
  const lstHolyName = useRecoilValue(HolyNameQuery)

  const setPhoneDialog = useSetRecoilState(PhoneCallDialogAtom)
  const setPreviewDialog = useSetRecoilState(DocumentPreviewDialogAtom)
  const reloadSearch = useSetRecoilState(ReloadStuSearch)

  const [toast, setToast] = useRecoilState(toastState)
  const [editable, setEditable] = useState(false)

  useEffect(() => {
    if (student) {
      const classInfo = student.studentClass.find(sl => sl.class.scholasticId === Number(sessionHelper().scholasticId))?.class
      const currentStudentClass = student.studentClass.find(s => s.classId === classInfo?.id)
      const isEditable =
        sessionHelper().roles.includes(Roles.Admin) ||
        sessionHelper().roles.includes(Roles.BanQuanTri) ||
        (sessionHelper().roles.includes(Roles.PhanDoanTruong) && Number(sessionHelper().userId) === classInfo?.leaderId) ||
        (currentStudentClass?.classId === Number(sessionHelper().classId) && currentStudentClass?.unionId === Number(sessionHelper().unionId))

      setEditable(isEditable)
    }
  }, [student])

  const validationSchema = Yup.object({
    studentMoreInfo: Yup.string().nullable(),
    note: Yup.string().nullable()
  })

  const stuForm = useFormik({
    initialValues: student ? { ...student } : {},
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true
  })

  const DatePicker_Props = (name, label, cusIcon) => {
    const { values, errors, touched, handleBlur, handleChange } = stuForm
    return {
      name,
      label,
      fullWidth: true,
      inputVariant: 'outlined',
      error: errors[name] && touched[name],
      helperText: errors[name] && touched[name] && errors[name],
      InputLabelProps: { shrink: true },
      format: 'dd/MM/yyyy',
      value: values[name] ?? null,
      // autoOk: true,
      onBlur: handleBlur,
      onChange: handleChange,
      KeyboardButtonProps: {
        'aria-label': 'change date'
      },
      readOnly: !editable,
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon icon={cusIcon} />
          </InputAdornment>
        ),
        readOnly: !editable
      }
    }
  }

  const handleClickCall = (e, phoneNo) => {
    e.preventDefault()
    if (phoneNo) {
      setPhoneDialog({ phoneCallDialog: true, phoneNo: phoneNo })
    }
  }

  const handleClickPreview = (e, studentId) => {
    e.preventDefault()
    setPreviewDialog({ openPreviewDialog: true, studentId: studentId, templateType: TemplateType.Document })
  }

  const handleSaveNotLoading = async (field, newValue, isMoreInfo = false) => {
    let val = stuForm.values

    if (isMoreInfo) {
      stuForm.setFieldValue(`studentMoreInfo.${field}`, newValue)
      val = {
        ...val,
        userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`,
        isIncludeMoreInfo: true,
        studentMoreInfo: { ...val.studentMoreInfo, [field]: newValue }
      }
    } else {
      stuForm.setFieldValue(field, newValue)
      val = { ...val, [field]: newValue, userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}` }
    }
    try {
      var res = await doPost(`student/updateStudent`, val)
      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        reloadSearch(old => old + 1)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const handleDateChange = (field, date, isMoreInfo = false) => {
    try {
      if (date === 'Invalid date' || date === 'Invalid Date') return
      if (moment(date).format('YYYY-MM-DD') === 'Invalid date' && date) return
      handleSaveNotLoading(field, isMoreInfo ? moment(date).format('YYYY-MM-DD') : date, isMoreInfo)
    } catch (err) {
      return
    }
  }

  const handleCheckChange = (field, newVal) => {
    try {
      handleSaveNotLoading(field, newVal)
    } catch (err) {
      return
    }
  }

  const checkShowForm = () => {
    return student?.status === StudentStatus.Active || sessionHelper().roles.includes(Roles.BanQuanTri)
  }

  return (
    <>
      {tabValue === 0 && student && (
        <Grid container>
          <Grid item xs={12} lg={12}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={2}>
                  <div className="p-1">
                    <div className="d-flex flex-column align-items-center">
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        variant="dot"
                        isActive={student?.status === StudentStatus.Active}
                        child={
                          <Avatar className="avatar-icon d-100" style={{ fontSize: '3.25rem' }}>
                            {`${stuForm.values?.stuFirstName?.substring(0, 1) ?? ''}${stuForm.values?.stuLastName?.substring(0, 1) ?? ''}`}
                          </Avatar>
                        }
                      />
                      <div className="w-100" style={{ textAlign: 'center', marginTop: '10px' }}>
                        {student?.status === StudentStatus.ChangeChurch && <span className="badge badge-danger">Chuyển xứ</span>}
                        {student?.status === StudentStatus.LeaveStudy && <span className="badge badge-warning">Nghỉ luôn</span>}
                        {student?.status === StudentStatus.Deleted && <span className="badge badge-dark">Đã xoá</span>}
                        {/* {(student?.status === StudentStatus.Active || student?.status === StudentStatus.InActive) && (
                          <Box>
                            <Button size="large" variant="outlined" color="primary">
                              Thay đổi AVATAR
                            </Button>
                          </Box>
                        )} */}
                        {editable && checkShowForm() && (
                          <Box>
                            <Button size="large" variant="outlined" style={{ color: 'red', borderColor: 'red' }} className="mt-2" onClick={e => handleClickPreview(e, student?.id)}>
                              Xem biểu mẫu
                            </Button>
                          </Box>
                        )}
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid container spacing={2} item xs={12} lg={10}>
                  <Grid container item spacing={2}>
                    <Grid item xs={12} sm={6} lg={4}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Mã Đoàn sinh"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FontAwesomeIcon icon={faBarcode} />
                            </InputAdornment>
                          ),
                          readOnly: true
                        }}
                        value={stuForm.values['stuCode'] || ''}
                      />
                    </Grid>
                    <HolyName
                      formData={stuForm}
                      holyname={lstHolyName[lstHolyName.findIndex(item => item.id === stuForm.values['stuHolyId'])] || lstHolyName[0]}
                      field="stuHolyId"
                      handleSaveHolyName={handleSaveNotLoading}
                      isEditable={editable}
                    />
                  </Grid>
                  <Grid container item spacing={2}>
                    <Grid item xs={12} sm={6} lg={8}>
                      <InlineTextField
                        label="Họ và Đệm"
                        field="stuFirstName"
                        value={stuForm.values?.stuFirstName}
                        icon={faUserTie}
                        handleChanged={handleSaveNotLoading}
                        isRequired={true}
                        isEditable={editable}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <InlineTextField
                        label="Tên"
                        field="stuLastName"
                        value={stuForm.values?.stuLastName}
                        icon={faUserTie}
                        handleChanged={handleSaveNotLoading}
                        isRequired={true}
                        isEditable={editable}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item spacing={2}>
                    <Grid item xs={12} sm={6} lg={4}>
                      <KeyboardDatePicker {...DatePicker_Props('stuDob', 'Sinh nhật', faBirthdayCake)} onChange={date => handleDateChange('stuDob', date)} />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <FormControl component="fieldset">
                        <FormGroup aria-label="position" row className="p-1">
                          <FormControlLabel
                            onChange={e => handleCheckChange('stuGender', e.target.checked)}
                            checked={stuForm.values['stuGender'] ? true : false}
                            control={<Radio color="primary" disabled={!editable} />}
                            label="Nam"
                            labelPlacement="end"
                            readOnly={!editable}
                          />
                          <FormControlLabel
                            onChange={e => handleCheckChange('stuGender', !e.target.checked)}
                            checked={!stuForm.values['stuGender'] ? true : false}
                            control={<Radio color="primary" disabled={!editable} />}
                            label="Nữ"
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container item spacing={2}>
                    <Grid item xs={12} sm={6} lg={4}>
                      <KeyboardDatePicker
                        {...DatePicker_Props('studentMoreInfo.stuBaptismDate', 'Ngày rửa tội', faHandHoldingWater)}
                        value={stuForm.values['studentMoreInfo']?.stuBaptismDate ?? null}
                        onChange={date => handleDateChange('stuBaptismDate', date, true)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <KeyboardDatePicker
                        {...DatePicker_Props('studentMoreInfo.stuEucharistDate', 'Ngày rước lễ', faPrayingHands)}
                        value={stuForm.values['studentMoreInfo']?.stuEucharistDate ?? null}
                        onChange={date => handleDateChange('stuEucharistDate', date, true)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <KeyboardDatePicker
                        {...DatePicker_Props('studentMoreInfo.stuConfirmationDate', 'Ngày Thêm sức', faHands)}
                        value={stuForm.values['studentMoreInfo']?.stuConfirmationDate ?? null}
                        onChange={date => handleDateChange('stuConfirmationDate', date, true)}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item spacing={2}>
                    <Grid item xs={12} lg={8}>
                      <InlineTextField
                        label="Ghi chú"
                        field="note"
                        value={stuForm.values['note'] ?? ''}
                        icon={faStickyNote}
                        handleChanged={handleSaveNotLoading}
                        isEditable={editable}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item spacing={2}>
                    <Grid item xs={12} lg={8}>
                      <InlineTextField
                        label="Địa chỉ"
                        field="stuAddress"
                        value={stuForm.values['studentMoreInfo']?.stuAddress ?? ''}
                        icon={faHome}
                        handleChanged={handleSaveNotLoading}
                        isEditable={editable}
                        isMoreInfo={true}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item spacing={2}>
                    <HolyName
                      formData={stuForm}
                      holyname={lstHolyName[lstHolyName.findIndex(item => item.id === stuForm.values['studentMoreInfo']?.stuFatherHolyId)] || lstHolyName[0]}
                      field="stuFatherHolyId"
                      handleSaveHolyName={handleSaveNotLoading}
                      isMoreInfo={true}
                      isEditable={editable}
                    />
                  </Grid>
                  <Grid container item spacing={2}>
                    <Grid item xs={12} sm={6} lg={8}>
                      <InlineTextField
                        label="Họ tên Cha"
                        field="stuFatherFullName"
                        value={stuForm.values['studentMoreInfo']?.stuFatherFullName ?? ''}
                        icon={faMale}
                        handleChanged={handleSaveNotLoading}
                        isEditable={editable}
                        isMoreInfo={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <InlineTextField
                        label="SĐT"
                        field="stuFatherPhone"
                        value={stuForm.values['studentMoreInfo']?.stuFatherPhone ?? ''}
                        icon={faPhoneAlt}
                        handleChanged={handleSaveNotLoading}
                        handleClickIcon={handleClickCall}
                        isEditable={editable}
                        isMoreInfo={true}
                      />
                    </Grid>
                  </Grid>
                  <Grid container item spacing={2}>
                    <HolyName
                      formData={stuForm}
                      holyname={lstHolyName[lstHolyName.findIndex(item => item.id === stuForm.values['studentMoreInfo']?.stuMotherHolyId)] || lstHolyName[0]}
                      field="stuMotherHolyId"
                      handleSaveHolyName={handleSaveNotLoading}
                      isMoreInfo={true}
                      isEditable={editable}
                    />
                  </Grid>
                  <Grid container item spacing={2}>
                    <Grid item xs={12} sm={6} lg={8}>
                      <InlineTextField
                        label="Họ tên Mẹ"
                        field="stuMotherFullName"
                        value={stuForm.values['studentMoreInfo']?.stuMotherFullName ?? ''}
                        icon={faFemale}
                        handleChanged={handleSaveNotLoading}
                        isEditable={editable}
                        isMoreInfo={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={4}>
                      <InlineTextField
                        label="SĐT"
                        field="stuMotherPhone"
                        value={stuForm.values['studentMoreInfo']?.stuMotherPhone ?? ''}
                        icon={faPhoneAlt}
                        handleChanged={handleSaveNotLoading}
                        handleClickIcon={handleClickCall}
                        isEditable={editable}
                        isMoreInfo={true}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
      )}
      {tabValue === 0 && !student && <div className="p-3">Chưa có thông tin Đoàn sinh.</div>}
    </>
  )
}

export default StudentInfo
