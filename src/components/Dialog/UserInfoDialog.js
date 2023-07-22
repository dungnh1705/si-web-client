import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { loadingState, toastState } from 'recoils/atoms'
import {
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  TextField
} from '@material-ui/core'
import { GroupQuery, HolyNameQuery } from 'recoils/selectors'
import { useFormik } from 'formik'
import { UserInfoDialogAtom } from './recoil'
import Yup from 'utils/Yup'
import { AutocompleteTextField, KeyboardDateField, ShortTextField } from '../Controls'

import { Roles } from 'app/enums'
import StyledCheckbox from 'components/UI/StyledCheckbox'
import StyledRadio from 'components/UI/StyledRadio'
import { KeyboardDatePicker } from '@material-ui/pickers'
import moment from 'moment/moment'
import { doPost } from 'utils/axios'
import _ from 'lodash'

import sessionHelper from 'utils/sessionHelper'

export default function UserInfoDialog({ reloadUserList }) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const setLoading = useSetRecoilState(loadingState)
  const [toast, setToast] = useRecoilState(toastState)
  const [dialog, setDialog] = useRecoilState(UserInfoDialogAtom)
  const { open, info } = dialog

  const holyNames = useRecoilValue(HolyNameQuery)
  const groups = useRecoilValue(GroupQuery)

  const useFormValidationFrom = Yup.object({})

  const userForm = useFormik({
    initialValues: { ...info, OldGroupName: info?.assignment.groupName },
    validationSchema: useFormValidationFrom,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true
  })

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
    userForm.resetForm()
  }

  const handleChangeUserInfo = async () => {
    setLoading(true)
    const val = userForm.values

    try {
      const res = await doPost(`user/update`, {
        ...val,
        assignment: {
          ...val.assignment,
          ScholasticId: sessionHelper().scholasticId,
          ModifiedBy: sessionHelper().fullName
        }
      })
      if (res && res.data.success) {
        setLoading(false)
        handleCloseDialog()
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        reloadUserList()
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const handleCheckLevel = e => {
    const val = Number(e.target.value)
    if (val) {
      let newData = []
      if (val === Roles.DuTruong) {
        newData = [...userForm.values['role'].filter(id => id !== Roles.HuynhTruong), val]
      } else {
        newData = [...userForm.values['role'].filter(id => id !== Roles.DuTruong), val]
      }

      userForm.setFieldValue('role', newData)
    }
  }

  const handleCheckRole = e => {
    const val = Number(e.target.value)
    if (val) {
      const roleExist = userForm.values['role'].includes(val)

      let newData = []
      if (roleExist) {
        newData = [...userForm.values['role'].filter(id => id !== val)]
      } else {
        newData = [...userForm.values['role'], val]
      }

      userForm.setFieldValue('role', newData)
    }
  }

  const checkIncludesRole = (current, role) => {
    if (current && current.length > 0) {
      return current.includes(role)
    }
    return false
  }

  const DatePicker_Props = (name, label, format) => {
    const { values, errors, touched, handleBlur, handleChange } = userForm
    return {
      name,
      label,
      fullWidth: true,
      inputVariant: 'outlined',
      error: _.get(errors, name) && _.get(touched, name),
      helperText: _.get(errors, name) && _.get(touched, name) && _.get(errors, name),
      value: _.get(values, name) ?? null,
      InputLabelProps: { shrink: true },
      format: format,
      autoOk: true,
      onBlur: handleBlur,
      onChange: handleChange,
      KeyboardButtonProps: {
        'aria-label': 'change date'
      }
    }
  }

  const TextField_Props = (name, label) => {
    const { values, errors, touched, handleBlur, handleChange } = userForm
    return {
      name,
      label,
      fullWidth: true,
      variant: 'outlined',
      error: _.get(errors, name) && _.get(touched, name),
      helperText: _.get(errors, name) && _.get(touched, name) && _.get(errors, name),
      value: _.get(values, name) ?? null,
      InputLabelProps: { shrink: true },
      onBlur: handleBlur,
      onChange: handleChange
    }
  }

  const handleChangeDate = (date, name, isCheckFuture) => {
    if (isCheckFuture && moment(date).isBefore(new Date())) {
      userForm.setFieldValue(name, date)
    } else {
      userForm.setFieldValue(name, date)
    }
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="responsive-roles-dialog" fullScreen={fullScreen} maxWidth="md">
      <DialogTitle>Thông tin Huynh trưởng | Dự trưởng</DialogTitle>
      <Divider />
      <DialogContent>
        <CardContent>
          <Grid container spacing={2} justifyContent={'flex-start'} alignItems={'center'}>
            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <b>Thông tin cá nhân</b>
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AutocompleteTextField formik={userForm} name="holyNameId" label="Tên Thánh" options={holyNames} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={userForm} name="firstName" label="Họ và đệm" maxLength={100} required />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField formik={userForm} name="lastName" label="Tên" maxLength={50} required />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl component="fieldset">
                <FormGroup aria-label="position" row className="p-1">
                  <FormControlLabel
                    onChange={e => {
                      userForm.setFieldValue('gender', e.target.checked)
                    }}
                    checked={userForm.values['gender']}
                    control={<StyledRadio color="primary" />}
                    label="Nam"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    onChange={e => {
                      userForm.setFieldValue('gender', !e.target.checked)
                    }}
                    checked={!userForm.values['gender']}
                    control={<StyledRadio color="primary" />}
                    label="Nữ"
                    labelPlacement="end"
                  />
                </FormGroup>
              </FormControl>
            </Grid>

            {/* row 2 */}
            <Grid item xs={12} sm={6} md={3}>
              <ShortTextField
                formik={userForm}
                name="phone"
                label="SĐT"
                type="phone"
                inputProps={{
                  maxLength: 10,
                  startAdornment: <InputAdornment position="start">+84</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KeyboardDateField formik={userForm} name="dob" label="Ngày sinh" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KeyboardDatePicker {...DatePicker_Props('patronDate', 'Ngày bổn mạng', 'dd/MM')} onChange={date => handleChangeDate(date, 'patronDate')} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KeyboardDatePicker {...DatePicker_Props('joinedYear', 'Năm gia nhập GLV', 'yyyy')} onChange={date => handleChangeDate(date, 'joinedYear')} views={['year']} />
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <FormControl component="fieldset">
                  <FormGroup aria-label="position" row>
                    <b>Xứ Đoàn</b>
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>

            {/*  row 3 */}
            <Grid container item xs={12} spacing={2} justifyContent={'flex-start'} alignItems={'flex-start'}>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Cấp bậc</FormLabel>
                  <FormGroup row className="p-1">
                    {/* <RadioGroup> */}
                    <FormControlLabel
                      control={<StyledRadio checked={checkIncludesRole(userForm.values['role'], Roles.DuTruong)} onChange={handleCheckLevel} value={Roles.DuTruong} />}
                      label="Dự trưởng"
                    />
                    <FormControlLabel
                      control={<StyledRadio checked={checkIncludesRole(userForm.values['role'], Roles.HuynhTruong)} onChange={handleCheckLevel} value={Roles.HuynhTruong} />}
                      label="Huynh trưởng"
                    />
                    {/* </RadioGroup> */}
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Chức vụ</FormLabel>
                  <FormGroup row className="p-1">
                    <FormControlLabel
                      control={
                        <StyledCheckbox
                          checked={checkIncludesRole(userForm.values['role'], Roles.PhanDoanTruong)}
                          onChange={handleCheckRole}
                          value={Roles.PhanDoanTruong}
                          disabled
                        />
                      }
                      label="Phân đoàn trưởng"
                    />
                    <FormControlLabel
                      control={<StyledCheckbox checked={checkIncludesRole(userForm.values['role'], Roles.NganhTruong)} onChange={handleCheckRole} value={Roles.NganhTruong} />}
                      label="Ngành trưởng"
                    />
                    <FormControlLabel
                      control={<StyledCheckbox checked={checkIncludesRole(userForm.values['role'], Roles.HocTap)} onChange={handleCheckRole} value={Roles.HocTap} />}
                      label="Học tập"
                    />
                    <FormControlLabel
                      control={<StyledCheckbox checked={checkIncludesRole(userForm.values['role'], Roles.KyLuat)} onChange={handleCheckRole} value={Roles.KyLuat} />}
                      label="Kỷ luật"
                    />
                    <FormControlLabel
                      control={<StyledCheckbox checked={checkIncludesRole(userForm.values['role'], Roles.PhongTrao)} onChange={handleCheckRole} value={Roles.PhongTrao} />}
                      label="Phong trào"
                    />
                    <FormControlLabel
                      control={<StyledCheckbox checked={checkIncludesRole(userForm.values['role'], Roles.BanQuanTri)} onChange={handleCheckRole} value={Roles.BanQuanTri} />}
                      label="Ban quản trị"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <TextField select {...TextField_Props('assignment.groupName', 'Phân đoàn')}>
                  {groups?.map((group, i) => (
                    <MenuItem key={`group-${group.groupName}`} value={group.groupName}>
                      {group.groupName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={handleChangeUserInfo} color="primary" variant="contained">
          Lưu
        </Button>
        <Button size="large" onClick={handleCloseDialog} variant="outlined">
          Quay về
        </Button>
      </DialogActions>
    </Dialog>
  )
}
