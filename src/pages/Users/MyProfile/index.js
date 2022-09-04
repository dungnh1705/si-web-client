import React, { Suspense, useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Divider,
  FormControl,
  FormGroup,
  FormControlLabel,
  CardActions,
  Badge,
  Avatar,
  InputAdornment,
  IconButton,
  Tooltip,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Hidden
} from '@material-ui/core'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUnlockAlt, faCamera, faIdBadge } from '@fortawesome/free-solid-svg-icons'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { KeyboardDatePicker } from '@material-ui/pickers'

import Yup from 'utils/Yup'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { useFormik } from 'formik'
import moment from 'moment'
import StringUtils from 'utils/StringUtils'
import StyledRadio from 'components/UI/StyledRadio'

import sessionHelper, { setLocalStoreData, deleteLoginData } from 'utils/sessionHelper'
import { doPost } from 'utils/axios'

import { HolyNameQuery, UserAvatarQuery } from 'recoils/selectors'
import { toastState, loadingState } from 'recoils/atoms'

import { UserQuery, ShowChangePassword, ReloadUser, OpenEditAvatar, EditCoverImage, CoverImageQuery } from './recoil'
import ChangePasswordDialog from './ChangePasswordDialog'
import EditAvatar from './EditAvatar'
import ShowImageModal from './ShowImageModal'

import coverPhoto from 'assets/images/Background.jpg'

function Profile() {
  const userInfo = useRecoilValue(UserQuery)
  const lstHolyName = useRecoilValue(HolyNameQuery)
  const avatar = useRecoilValue(UserAvatarQuery)
  const cover = useRecoilValue(CoverImageQuery)

  const setLoading = useSetRecoilState(loadingState)
  const setOpen = useSetRecoilState(OpenEditAvatar)
  const setReload = useSetRecoilState(ReloadUser)
  const setEditCover = useSetRecoilState(EditCoverImage)

  const [toast, setToast] = useRecoilState(toastState)
  const [showChangePass, setShowChangePass] = useRecoilState(ShowChangePassword)

  const [openAvatar, setOpenAvatar] = useState(false)
  const [openPreview, setOpenReview] = useState(false)

  const handleClickSave = async e => {
    e.preventDefault()
    const val = userForm.values
    setLoading(true)

    try {
      const res = await doPost(`user/update`, val)
      if (res && res.data.success) {
        setLoading(false)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setReload(reload => reload + 1)
        updateLocalState()

        if (sessionHelper().isFirstLogin) {
          deleteLoginData()
          window.location.href = '/Login'
        }
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const updateLocalState = () => {
    setLocalStoreData('holyNameId', userForm.values['holyNameId'])
    setLocalStoreData('firstName', userForm.values['firstName'])
    setLocalStoreData('lastName', userForm.values['lastName'])
  }

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Không để trống').max(100, 'Không nhập nhiều hơn 100 ký tự.'),
    lastName: Yup.string().required('Không để trống').max(50, 'Không nhập nhiều hơn 50 ký tự.'),
    phone: Yup.string().max(10, 'Không nhập nhiều hơn 10 ký tự.').nullable(),
    address: Yup.string().max(150, 'Không nhập nhiều hơn 150 ký tự.').nullable()
  })

  const userForm = useFormik({
    initialValues: { ...userInfo } || {},
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true,
    initialErrors: { firstName: 'Required' }
  })

  const TextField_Props = (name, label, maxLength) => {
    const { values, errors, touched, handleBlur, handleChange } = userForm
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

  const DatePicker_Props = (name, label, format) => {
    const { values, errors, touched, handleBlur, handleChange } = userForm
    return {
      name,
      label,
      fullWidth: true,
      inputVariant: 'outlined',
      error: errors[name] && touched[name],
      helperText: errors[name] && touched[name] && errors[name],
      InputLabelProps: { shrink: true },
      format: format,
      value: values[name] ?? null,
      autoOk: true,
      onBlur: handleBlur,
      onChange: handleChange,
      KeyboardButtonProps: {
        'aria-label': 'change date'
      }
    }
  }

  const openResetPasswordDialog = () => {
    setShowChangePass(!showChangePass)
  }

  const handleChangeInput = (val, name) => {
    userForm.setFieldValue(name, StringUtils.capitalize(val))
  }

  const handleChangeDate = (date, name, isCheckFuture) => {
    if (isCheckFuture && moment(date).isBefore(new Date())) {
      userForm.setFieldValue(name, date)
    } else {
      userForm.setFieldValue(name, date)
    }
  }

  const handleAvatarClick = () => {
    setOpenAvatar(prevAvatar => !prevAvatar)
  }

  const handleAvatarClose = event => {
    setOpenAvatar(false)
  }

  const anchorAvRef = useRef(null)
  const prevAvatarOpen = useRef(openAvatar)

  useEffect(() => {
    if (prevAvatarOpen.current === true && openAvatar === false) {
      anchorAvRef.current.focus()
    }
    prevAvatarOpen.current = openAvatar
  }, [openAvatar])

  const handleEditCoverClick = () => {
    setEditCover(true)
    setOpen(true)
  }

  return (
    <Suspense fallback={<>Đang tải thông tin cá nhân ...</>}>
      <Grid container spacing={3} justifyContent="center" className="mt-3">
        <Grid item xs={12} lg={8}>
          <Card className="mb-2 w-100">
            <div className="card-img-wrapper">
              <div className="card-badges">
                <Tooltip title="Đổi mật khẩu">
                  <IconButton size="medium" onClick={openResetPasswordDialog}>
                    <FontAwesomeIcon icon={faUnlockAlt} />
                  </IconButton>
                </Tooltip>
              </div>
              <div className="card-badges card-badges-bottom">
                <Hidden smDown>
                  <Button size="medium" style={{ backgroundColor: 'rgb(246 249 253)' }} onClick={handleEditCoverClick} startIcon={<FontAwesomeIcon icon={faCamera} />}>
                    Chỉnh sửa ảnh bìa
                  </Button>
                </Hidden>

                <Hidden mdUp>
                  <Button size="medium" onClick={handleEditCoverClick} style={{ backgroundColor: 'rgb(246 249 253)' }}>
                    <FontAwesomeIcon icon={faCamera} />
                  </Button>
                </Hidden>
              </div>
              <img alt="" className="card-img-top" src={cover ?? coverPhoto} width="851px" height="315px" />
            </div>
            <div className="card-body text-center card-body-avatar">
              <div className="avatar-icon-wrapper mt--5">
                <Badge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  badgeContent={
                    <Tooltip title="Cập nhật ảnh đại diện">
                      <IconButton
                        size="medium"
                        onClick={() => {
                          setEditCover(false)
                          setOpen(true)
                        }}
                        style={{ backgroundColor: 'rgb(232 235 239)' }}>
                        <FontAwesomeIcon icon={faCamera} />
                      </IconButton>
                    </Tooltip>
                  }>
                  <Avatar
                    ref={anchorAvRef}
                    className="avatar-icon rounded-circle border-white border-3 d-120"
                    alt={`${userInfo.firstName} ${userInfo.lastName}`}
                    src={avatar.avatarUrl ?? ''}
                    onClick={handleAvatarClick}
                    style={{ fontSize: '3.25rem', cursor: 'pointer' }}>
                    {`${userInfo.firstName?.substring(0, 1)}${userInfo.lastName?.substring(0, 1)}`}
                  </Avatar>
                </Badge>
              </div>
              <Popper style={{ marginTop: '10px' }} open={openAvatar} anchorEl={anchorAvRef.current} role={undefined} transition placement="bottom">
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                    <Paper>
                      <ClickAwayListener onClickAway={handleAvatarClose}>
                        <MenuList autoFocusItem={openAvatar} id="menu-avatar-list">
                          <MenuItem
                            onClick={e => {
                              setOpenReview(true)
                              handleAvatarClose(e)
                            }}>
                            <Grid container spaing={2}>
                              <Grid item xs={2}>
                                <FontAwesomeIcon icon={faCamera} size="lg" />
                              </Grid>
                              <Grid item xs={3}>
                                <strong>Xem ảnh đại diện</strong>
                              </Grid>
                            </Grid>
                          </MenuItem>
                          <MenuItem
                            onClick={e => {
                              setEditCover(false)
                              setOpen(true)
                              handleAvatarClose(e)
                            }}>
                            <Grid container spaing={2}>
                              <Grid item xs={2}>
                                <FontAwesomeIcon icon={faIdBadge} size="lg" />
                              </Grid>
                              <Grid item xs={3}>
                                <strong>Cập nhật ảnh đại diện</strong>
                              </Grid>
                            </Grid>
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
              <h3 className="font-weight-bold mt--5">
                {lstHolyName.find(i => i.id === userInfo.holyNameId)?.name} {userInfo.firstName} {userInfo.lastName}
              </h3>
            </div>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={8}>
          <Card className="card-box mb-4 w-100">
            <div className="card-header">
              <div className="card-header--title">
                <h4 className="font-size-lg mb-0 py-2 font-weight-bold">Thông tin cá nhân</h4>
              </div>
            </div>
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={4}>
                  <Autocomplete
                    value={lstHolyName.find(i => i.id === userForm.values['holyNameId'])}
                    onChange={(event, newValue) => {
                      if (newValue) userForm.setFieldValue('holyNameId', newValue?.id)
                    }}
                    disableClearable
                    id="userHolyId"
                    options={lstHolyName}
                    renderOption={(option, { inputValue }) => {
                      const matches = match(option.name, inputValue)
                      const parts = parse(option.name, matches)
                      return (
                        <div>
                          {parts.map((part, index) => (
                            <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                              {part.text}
                            </span>
                          ))}
                        </div>
                      )
                    }}
                    getOptionLabel={option => option.name}
                    renderInput={params => (
                      <TextField
                        label="Tên Thánh"
                        InputLabelProps={{
                          shrink: true
                        }}
                        variant="outlined"
                        fullWidth={true}
                        {...params}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} lg={4}>
                  <TextField {...TextField_Props('firstName', 'Họ và đệm', 100)} onChange={e => handleChangeInput(e.target.value, 'firstName')} />
                </Grid>
                <Grid item xs={12} lg={4}>
                  <TextField {...TextField_Props('lastName', 'Tên', 50)} onChange={e => handleChangeInput(e.target.value, 'lastName')} />
                </Grid>
                <Grid container item spacing={3} alignItems="center">
                  <Grid item xs={12} lg={4}>
                    <KeyboardDatePicker {...DatePicker_Props('dob', 'Ngày sinh', 'dd/MM/yyyy')} onChange={date => handleChangeDate(date, 'dob', true)} disableFuture />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <KeyboardDatePicker {...DatePicker_Props('patronDate', 'Ngày bổn mạng', 'dd/MM')} onChange={date => handleChangeDate(date, 'patronDate')} />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <FormControl component="fieldset">
                      <FormGroup aria-label="position" row className="p-1">
                        <FormControlLabel
                          onChange={e => userForm.setFieldValue('gender', e.target.checked)}
                          checked={userForm.values['gender']}
                          control={<StyledRadio color="primary" />}
                          label="Nam"
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          onChange={e => userForm.setFieldValue('gender', !e.target.checked)}
                          checked={!userForm.values['gender']}
                          control={<StyledRadio color="primary" />}
                          label="Nữ"
                          labelPlacement="end"
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container item spacing={3}>
                  <Grid item xs={12} lg={4}>
                    <KeyboardDatePicker {...DatePicker_Props('baptismDate', 'Ngày rửa tội', 'dd/MM/yyyy')} onChange={date => handleChangeDate(date, 'baptismDate')} />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <KeyboardDatePicker {...DatePicker_Props('eucharistDate', 'Ngày rước lễ', 'dd/MM/yyyy')} onChange={date => handleChangeDate(date, 'eucharistDate')} />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <KeyboardDatePicker {...DatePicker_Props('confirmationDate', 'Ngày thêm sức', 'dd/MM/yyyy')} onChange={date => handleChangeDate(date, 'confirmationDate')} />
                  </Grid>
                  {/* <Grid item xs={12} lg={4}>
                      <KeyboardDatePicker {...DatePicker_Props('dob', 'Ngày nhận sách Thánh', 'yyyy')} onChange={(date) => handleChangeDate(date, 'dob')} />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <KeyboardDatePicker {...DatePicker_Props('dob', 'Ngày tuyên hứa', 'yyyy')} onChange={(date) => handleChangeDate(date, 'dob')} />
                    </Grid> */}
                  <Grid item xs={12} lg={4}>
                    <KeyboardDatePicker {...DatePicker_Props('joinedYear', 'Năm gia nhập GLV', 'yyyy')} onChange={date => handleChangeDate(date, 'joinedYear')} views={['year']} />
                  </Grid>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <TextField
                    {...TextField_Props('phone', 'SĐT', 10)}
                    type="number"
                    InputProps={{
                      maxLength: 10,
                      startAdornment: <InputAdornment position="start">+84</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} lg={8}>
                  <TextField {...TextField_Props('address', 'Địa chỉ', 150)} onChange={e => handleChangeInput(e.target.value, 'address')} type="text" />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container item spacing={2} justifyContent="flex-end">
                <Grid item>
                  <Button size="large" color="primary" onClick={handleClickSave} variant="contained" type="submit" disabled={!userForm.isValid}>
                    Lưu
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Suspense fallback={<>Đang tải thông tin . . .</>}>
        <ChangePasswordDialog />
        <EditAvatar />
        <ShowImageModal open={openPreview} handleClose={() => setOpenReview(!openPreview)} />
      </Suspense>
    </Suspense>
  )
}

export default Profile
