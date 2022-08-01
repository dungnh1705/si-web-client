import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  FormControl,
  DialogActions,
  Button,
  FormControlLabel,
  FormGroup,
  ButtonGroup,
  Tooltip,
  Typography,
  IconButton,
  Divider
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import FlagRoundedIcon from '@material-ui/icons/FlagRounded'

// 3Party
import Yup from 'utils/Yup'
import { useFormik } from 'formik'
import { doPost } from 'utils/axios'
import { get } from 'lodash'

// External
import { StudentStatus } from 'app/enums'
import sessionHelper from 'utils/sessionHelper'
import { HolyNameQuery } from 'recoils/selectors'
import { toastState } from 'recoils/atoms'
import config from 'config'
import StyledCheckbox from 'components/UI/StyledCheckbox'
import StyledRadio from 'components/UI/StyledRadio'
import ButtonLoading from 'components/UI/ButtonLoading'
import { ShortTextField, AutocompleteTextField, KeyboardDateField } from 'components/Controls'

// Internal
import { StudentDialogAtom, PhoneCallDialogAtom } from './recoil'
import { ReloadStudentClass } from 'pages/HuynhTruong/ManageStudentClass/recoil'
import { ReloadStudentGroup } from 'pages/PhanDoanTruong/ManageStudentsGroup/recoil'
import ModalSkeleton from 'components/Loading/modal-skeleton'

export const StudentDialog = () => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [studentDialog, setStudentDialog] = useRecoilState(StudentDialogAtom)
  const [phoneDialog, setPhoneDialog] = useRecoilState(PhoneCallDialogAtom)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useRecoilState(toastState)
  const lstHolyName = useRecoilValue(HolyNameQuery)
  const setReloadClass = useSetRecoilState(ReloadStudentClass)
  const setReloadGroup = useSetRecoilState(ReloadStudentGroup)
  const [changeStatus, setChangeStatus] = useState(false)

  const { stuDialog, pageCall, student } = studentDialog
  const [isTeamLead, setIsTeamLead] = useState(false)

  useEffect(() => {
    setIsTeamLead(student?.studentClass?.find(sl => sl.classId === Number(sessionHelper().classId))?.isTeamLead)
  }, [student])

  const validationSchema = Yup.object({
    stuHolyId: Yup.string().required('Không để trống').min(0, 'Phải chọn Tên Thánh'),
    stuFirstName: Yup.string().required('Không để trống').max(100, 'Không nhập nhiều hơn 100 ký tự.'),
    stuLastName: Yup.string().required('Không để trống').max(50, 'Không nhập nhiều hơn 50 ký tự.'),
    note: Yup.string().max(250, 'Không nhập nhiều hơn 250 ký tự.').nullable(),
    studentMoreInfo: Yup.object({
      stuFatherFullName: Yup.string().max(150, 'Không nhập nhiều hơn 150 ký tự.').nullable(),
      stuMotherFullName: Yup.string().max(150, 'Không nhập nhiều hơn 150 ký tự.').nullable(),
      stuAddress: Yup.string().max(250, 'Không nhập nhiều hơn 250 ký tự.').nullable(),
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
  })

  const formData = useFormik({
    initialValues: { ...student },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true
  })

  const handleClickCall = e => {
    e.preventDefault()

    const phoneNo = get(formData.values, e.target.name)
    if (!isEdit && phoneNo) {
      setPhoneDialog({ ...phoneDialog, phoneCallDialog: true, phoneNo: phoneNo })
    }
  }

  const handleClose = () => {
    setStudentDialog({ ...studentDialog, stuDialog: false, pageCall: undefined })
    setIsEdit(false)
    handleCancelStatus()
  }

  const handleReload = () => {
    if (pageCall) {
      if (pageCall === 'HT-Student') setReloadClass(reload => reload + 1)
      if (pageCall === 'PDT-Student') setReloadGroup(reload => reload + 1)
    }
  }

  const saveStudentInfo = async e => {
    e.preventDefault()
    setLoading(true)

    const formVal = formData.values

    try {
      const res = await doPost(`student/updateStudent`, {
        ...formVal,
        userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`
      })

      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setIsEdit(!isEdit)
        handleReload()
        setLoading(false)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const handleClickStatus = (e, newValue) => {
    e.preventDefault()

    if (newValue !== formData.values['status']) {
      setChangeStatus(true)
      formData.setFieldValue('newValue', newValue)
    } else {
      setChangeStatus(false)
      formData.setFieldValue('newValue', formData.values['status'])
    }
  }

  const handleChangeStatus = async e => {
    e.preventDefault()
    setLoading(true)

    let data = {
      userId: sessionHelper().userId,
      userFullName: `${sessionHelper().firstName} ${sessionHelper().lastName}`,
      studentId: formData.values['id'],
      oldValue: formData.values['status'],
      newValue: formData.values['newValue'],
      note: formData.values['reason']
    }

    try {
      const res = await doPost(`student/updateStudentStatus`, data)

      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setChangeStatus(false)
        formData.setValues({ ...formData.values, status: data.newValue, reason: '' })
        handleReload()
        setLoading(false)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const styles = theme => ({
    root: {
      margin: 0,
      padding: theme.spacing(2)
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  })

  const handleCancelStatus = () => {
    setChangeStatus(false)
    formData.setFieldValue('newValue', formData.values['status'])
  }

  const handleAssignTeamLead = async e => {
    e.preventDefault()
    setLoading(true)

    let stuClass = student.studentClass.find(sl => sl.classId === Number(sessionHelper().classId))
    try {
      let res = await doPost(`student/updateTeamLead`, stuClass)
      if (res && res.data.success) {
        setLoading(false)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        handleReload()
        setIsTeamLead(true)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const DialogTitleCustom = withStyles(styles)(props => {
    const { children, classes, onClick, ...other } = props

    // let isTeamLead = student?.studentClass?.find((sl) => sl.classId === Number(localStorage.classId))?.isTeamLead
    // Kiểm tra Đoàn sinh đã được phân đội chưa
    const isAssigned = student?.studentClass?.find(sl => sl.classId === Number(sessionHelper().classId))?.team !== 0

    return (
      <DialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {Number(sessionHelper().classId) !== 0 && !isTeamLead && isAssigned ? (
          <Tooltip title="Đánh dấu là đội trưởng">
            <IconButton size="medium" aria-label="teamlead" className={classes.closeButton} onClick={onClick}>
              <FlagRoundedIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </DialogTitle>
    )
  })

  return loading ? (
    <ModalSkeleton loading={true} />
  ) : (
    <Dialog open={stuDialog} onClose={handleClose} aria-labelledby="responsive-dialog-title" fullScreen={fullScreen} maxWidth="lg">
      <DialogTitleCustom onClick={handleAssignTeamLead}>Thông tin Đoàn sinh</DialogTitleCustom>
      <Divider />
      <DialogContent>
        {isTeamLead && (
          <span className="ribbon-vertical ribbon-vertical--danger ribbon-vertical--right">
            <span>Đội trưởng</span>
          </span>
        )}
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {student?.status !== StudentStatus.InActive && (
            <Grid container item xs={12} spacing={2} alignItems="center">
              <Grid item xs={12} lg={4}>
                <ButtonGroup variant="contained" aria-label="contained primary button group">
                  <Button
                    color={(formData.values['newValue'] ?? formData.values['status']) === StudentStatus.Active ? 'primary' : 'default'}
                    onClick={e => handleClickStatus(e, StudentStatus.Active)}>
                    Đang học
                  </Button>
                  <Button
                    color={(formData.values['newValue'] ?? formData.values['status']) === StudentStatus.ChangeChurch ? 'primary' : 'default'}
                    onClick={e => handleClickStatus(e, StudentStatus.ChangeChurch)}>
                    Chuyển xứ
                  </Button>
                  <Button
                    color={(formData.values['newValue'] ?? formData.values['status']) === StudentStatus.LeaveStudy ? 'primary' : 'default'}
                    onClick={e => handleClickStatus(e, StudentStatus.LeaveStudy)}>
                    Nghỉ luôn
                  </Button>
                </ButtonGroup>
              </Grid>
              <Grid item xs={12} lg={5} hidden={!changeStatus}>
                <ShortTextField formik={formData} name="reason" label="Lý do" maxLength={150} required />
              </Grid>
              <Grid container item xs={12} lg={3} spacing={2} hidden={!changeStatus} alignItems="center" justifyContent="flex-end">
                <Grid item xs={6} sm={3} md={2} lg={6}>
                  <ButtonLoading btnText="Lưu" loading={loading} handleButtonClick={handleChangeStatus} disabled={!formData.values['reason']} />
                </Grid>
                <Grid item xs={6} sm={3} md={2} lg={6}>
                  <Button size="large" onClick={handleCancelStatus} variant="outlined" fullWidth>
                    Hủy bỏ
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid container item spacing={2}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    onChange={e => (!isEdit ? undefined : formData.setFieldValue('isDisability', e.target.checked))}
                    checked={formData.values['isDisability']}
                    control={<StyledCheckbox color="primary" />}
                    label="Trường hợp đặc biệt"
                    labelPlacement="end"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3} lg={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="Mã Đoàn sinh"
                value={formData.values['stuCode']}
                type="text"
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          <Grid container item spacing={2} className="mt-2">
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row>
                  <b>
                    <i>Thông tin Đoàn sinh</i>
                  </b>
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              {!isEdit && (
                <TextField
                  value={lstHolyName.find(item => item.id === formData.values['stuHolyId'])?.name}
                  label="Tên Thánh"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                  fullWidth={true}
                  type="text"
                  InputProps={{ readOnly: true }}
                />
              )}
              {isEdit && <AutocompleteTextField formik={formData} name="stuHolyId" label="Tên Thánh" options={lstHolyName} />}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="stuFirstName" label="Họ và đệm" maxLength={100} required readOnly={!isEdit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="stuLastName" label="Tên" maxLength={50} required readOnly={!isEdit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row className="p-1">
                  <FormControlLabel
                    onChange={e => {
                      if (isEdit) formData.setFieldValue('stuGender', e.target.checked)
                    }}
                    checked={formData.values['stuGender']}
                    control={<StyledRadio color="primary" />}
                    label="Nam"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    onChange={e => {
                      if (isEdit) formData.setFieldValue('stuGender', !e.target.checked)
                    }}
                    checked={!formData.values['stuGender']}
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
              <KeyboardDateField formik={formData} name="stuDob" label="Ngày sinh" readOnly={!isEdit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuBornIn" label="Sinh tại" readOnly={!isEdit} />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <KeyboardDateField formik={formData} name="studentMoreInfo.stuBaptismDate" label="Rửa Tội ngày" readOnly={!isEdit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuBaptismBy" label="Do Linh Mục" readOnly={!isEdit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuBaptismIn" label="Tại" readOnly={!isEdit} />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <KeyboardDateField formik={formData} name="studentMoreInfo.stuEucharistDate" label="Rước lễ Lần đầu ngày" readOnly={!isEdit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuEucharistIn" label="Tại" readOnly={!isEdit} />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <KeyboardDateField formik={formData} name="studentMoreInfo.stuConfirmationDate" label="Thêm sức ngày" readOnly={!isEdit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuConfirmationIn" label="Tại" readOnly={!isEdit} />
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
              {!isEdit && (
                <TextField
                  value={lstHolyName.find(item => item.id === get(formData.values, 'studentMoreInfo.stuFatherHolyId'))?.name}
                  label="Tên Thánh"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                  fullWidth={true}
                  type="text"
                  InputProps={{ readOnly: true }}
                />
              )}
              {isEdit && <AutocompleteTextField formik={formData} name="studentMoreInfo.stuFatherHolyId" label="Tên Thánh" options={lstHolyName} />}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuFatherFullName" label="Họ và tên Cha" maxLength={150} readOnly={!isEdit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuFatherDob" label="Năm sinh" readOnly={!isEdit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuFatherPhone" label="SĐT Cha" maxLength={11} readOnly={!isEdit} onClick={handleClickCall} />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              {!isEdit && (
                <TextField
                  value={lstHolyName.find(item => item.id === get(formData.values, 'studentMoreInfo.stuMotherHolyId'))?.name}
                  label="Tên Thánh"
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="outlined"
                  fullWidth={true}
                  type="text"
                  InputProps={{ readOnly: true }}
                />
              )}
              {isEdit && <AutocompleteTextField formik={formData} name="studentMoreInfo.stuMotherHolyId" label="Tên Thánh" options={lstHolyName} />}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuMotherFullName" label="Họ và tên Mẹ" maxLength={150} readOnly={!isEdit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuMotherDob" label="Năm sinh" maxLength={150} readOnly={!isEdit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuMotherPhone" label="SĐT Mẹ" maxLength={11} readOnly={!isEdit} onClick={handleClickCall} />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuAddress" label="Địa chỉ" maxLength={250} readOnly={!isEdit} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={formData} name="studentMoreInfo.stuArea" label="Giáo Khu/Họ" maxLength={100} readOnly={!isEdit} />
            </Grid>
          </Grid>

          <Grid container item spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <ShortTextField formik={formData} name="note" label="Lưu ý về Đoàn sinh" readOnly={!isEdit} />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ padding: '10px 32px' }}>
        <Grid container item spacing={2} justifyContent="flex-end">
          <Grid item xs={6} sm={3} md={2}>
            {isEdit && <ButtonLoading btnText="Lưu" loading={loading} handleButtonClick={saveStudentInfo} disabled={!formData.isValid || changeStatus} />}
            {!isEdit && (
              <Button size="large" onClick={() => setIsEdit(!isEdit)} color="secondary" variant="contained" disabled={changeStatus} fullWidth>
                Chỉnh sửa
              </Button>
            )}
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button size="large" onClick={handleClose} variant="outlined" fullWidth>
              Quay về
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}
