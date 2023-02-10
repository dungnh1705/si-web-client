import React, { Suspense, useEffect } from 'react'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import { Grid, FormControl, FormLabel, FormGroup, FormControlLabel, Button, Card, RadioGroup } from '@material-ui/core'
import StyledCheckbox from 'components/UI/StyledCheckbox'
import StyledRadio from 'components/UI/StyledRadio'

import { EditingUser, UserFormMode, ReloadUserList } from './recoil'
import { loadingState, toastState } from 'recoils/atoms'
import moment from 'moment'
import { Roles, UserStatus } from 'app/enums'

import { useFormik } from 'formik'
import config from 'config'
import { doPost } from 'utils/axios'

const initialValues = []

const UserRolesForm = () => {
  const editingUser = useRecoilValue(EditingUser)
  const userFormMode = useRecoilValue(UserFormMode)
  const setLoading = useSetRecoilState(loadingState)
  const setReloadUserList = useSetRecoilState(ReloadUserList)
  const [toast, setToast] = useRecoilState(toastState)

  const formData = useFormik({
    initialValues: initialValues,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true
  })

  useEffect(() => {
    const newFormData =
      userFormMode === 'Edit'
        ? editingUser?.roles?.map((e, i) => {
            return e.id
          })
        : initialValues
    formData.resetForm({ values: newFormData })
  }, [userFormMode, editingUser])

  const handleRole = e => {
    const val = Number(e.target.value)
    if (val === Roles.DuTruong) {
      formData.values = formData.values.filter(i => i !== Roles.HuynhTruong)
      formData.values.push(val)
      formData.resetForm({ values: formData.values })
    } else {
      formData.values = formData.values.filter(i => i !== Roles.DuTruong)
      formData.values.push(val)
      formData.resetForm({ values: formData.values })
    }
  }

  const handleCheckRole = e => {
    const val = Number(e.target.value)
    const itemExist = formData.values.includes(val)
    if (itemExist) {
      formData.resetForm({ values: formData.values.filter(i => i !== val) })
    } else {
      formData.values.push(val)
      formData.resetForm({ values: formData.values })
    }
  }

  const handleClickSave = async e => {
    e.preventDefault()

    let data = formData.values.map((e, i) => {
      return { Id: e }
    })
    setLoading(true)

    try {
      var res = await doPost(`user/updateRoles`, { id: editingUser.id, roles: data })

      if (res.data && res.data.success) {
        setLoading(false)
        setReloadUserList(reload => reload + 1)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
      }
    } catch (err) {
      // Todo:
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  return (
    <Suspense>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Card className="card-box pt-4">
            <div className="card-img-wrapper">
              <div className="card-badges card-badges-top mr-2">
                {editingUser?.status == UserStatus.NewUser && <div className="badge badge-info">Tài khoản mới</div>}
                {editingUser?.status == UserStatus.Absent && <div className="badge badge-warning">Tạm nghỉ</div>}
                {editingUser?.status == UserStatus.Active && <div className="badge badge-success">Đang hoạt động</div>}
                {editingUser?.status == UserStatus.Deleted && <div className="badge badge-error">Đã xóa</div>}
              </div>
            </div>
            <div className="d-flex align-items-center px-4 mb-3">
              <div className="w-100">
                <span className="text-black-50 d-block pb-1">Tên Thánh, Họ và Tên</span>
                <span className="font-weight-bold font-size-lg">{`${editingUser?.holyName?.name ?? ''} ${editingUser?.firstName ?? ''} ${editingUser?.lastName ?? ''}`}</span>
              </div>
            </div>
            <div className="my-3 font-size-sm p-3 mx-4 bg-secondary rounded-sm">
              <div className="d-flex justify-content-between">
                <span className="font-weight-bold">Email:</span>
                <span className="text-black-50">{editingUser?.email ?? ''}</span>
              </div>
              <div className="d-flex justify-content-between py-2">
                <span className="font-weight-bold">Phân đoàn:</span>
                <span className="text-black-50">{editingUser?.assignment?.groupName ?? 'Chưa phân công tác'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="font-weight-bold">Ngày sinh:</span>
                <span className="text-black-50">{editingUser?.dob ? moment(editingUser?.dob).format('DD-MM-YYYY') : 'Chưa nhập'}</span>
              </div>
            </div>
            <Grid container item xs={12} alignItems="center" justifyContent="center">
              <Grid item xs={12} className="pl-md-5">
                <FormControl component="fieldset">
                  <FormLabel component="legend">Cấp bậc</FormLabel>
                  <FormGroup row className="p-1">
                    {/* <RadioGroup> */}
                    <FormControlLabel control={<StyledRadio checked={formData.values.includes(Roles.DuTruong)} onChange={handleRole} value={Roles.DuTruong} />} label="Dự trưởng" />
                    <FormControlLabel
                      control={<StyledRadio checked={formData.values.includes(Roles.HuynhTruong)} onChange={handleRole} value={Roles.HuynhTruong} />}
                      label="Huynh trưởng"
                    />
                    {/* </RadioGroup> */}
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} className="pl-md-5">
                <FormControl component="fieldset">
                  <FormLabel component="legend">Chức vụ</FormLabel>
                  <FormGroup row className="p-1">
                    <FormControlLabel
                      control={<StyledCheckbox checked={formData.values.includes(Roles.PhanDoanTruong)} onChange={handleCheckRole} value={Roles.PhanDoanTruong} disabled />}
                      label="Phân đoàn trưởng"
                    />
                    <FormControlLabel
                      control={<StyledCheckbox checked={formData.values.includes(Roles.NganhTruong)} onChange={handleCheckRole} value={Roles.NganhTruong} />}
                      label="Ngành trưởng"
                    />
                    <FormControlLabel
                      control={<StyledCheckbox checked={formData.values.includes(Roles.HocTap)} onChange={handleCheckRole} value={Roles.HocTap} />}
                      label="Học tập"
                    />
                    <FormControlLabel
                      control={<StyledCheckbox checked={formData.values.includes(Roles.KyLuat)} onChange={handleCheckRole} value={Roles.KyLuat} />}
                      label="Kỷ luật"
                    />
                    <FormControlLabel
                      control={<StyledCheckbox checked={formData.values.includes(Roles.PhongTrao)} onChange={handleCheckRole} value={Roles.PhongTrao} />}
                      label="Phong trào"
                    />
                    <FormControlLabel
                      control={<StyledCheckbox checked={formData.values.includes(Roles.BanQuanTri)} onChange={handleCheckRole} value={Roles.BanQuanTri} />}
                      label="Ban quản trị"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Grid item justifyContent="flex-end" container>
            <Button size="large" color="primary" variant="contained" type="submit" onClick={handleClickSave} disabled={userFormMode !== 'Edit'}>
              Lưu
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Suspense>
  )
}

export default UserRolesForm
