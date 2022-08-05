import {
  Dialog,
  DialogTitle,
  DialogContent,
  CardContent,
  Grid,
  DialogActions,
  Typography,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  RadioGroup,
  FormControlLabel,
  Divider
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import { useFormik } from 'formik'
import StyledCheckbox from 'components/UI/StyledCheckbox'
import StyledRadio from 'components/UI/StyledRadio'
import ButtonLoading from 'components/UI/ButtonLoading'

import { doPost } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { Roles } from 'app/enums'

import { toastState } from 'recoils/atoms'
import { HolyNameQuery } from 'recoils/selectors'
import { RolesDialogAtom } from './recoil'
import { ReloadUserInGroup } from 'pages/PhanDoanTruong/AssignUserUnion/recoil'
// import { ReloadListAssign } from 'containers/Users/Assignment/recoil'

const init = []

export const RolesDialog = () => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  let [loading, setLoading] = useState(false)
  const [toast, setToast] = useRecoilState(toastState)

  const lstHolyname = useRecoilValue(HolyNameQuery)
  const [reload, setReload] = useRecoilState(ReloadUserInGroup)
  // const [reloadAssign, setReloadAssign] = useRecoilState(ReloadListAssign)

  let [rolesDialog, setRolesDialog] = useRecoilState(RolesDialogAtom)
  let { open, pageCall, user } = rolesDialog

  const formRoles = useFormik({
    initialValues: init,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true
  })

  useEffect(() => {
    const newFormData = user
      ? user.roles.map(e => {
          return e.id
        })
      : []
    formRoles.resetForm({ values: newFormData })
  }, [user])

  const handleRole = e => {
    const val = Number(e.target.value)

    if (val === Roles.DuTruong) {
      formRoles.values = formRoles.values.filter(i => i !== Roles.HuynhTruong)
      formRoles.values.push(val)
      formRoles.resetForm({ values: formRoles.values })
    } else {
      formRoles.values = formRoles.values.filter(i => i !== Roles.DuTruong)
      formRoles.values.push(val)
      formRoles.resetForm({ values: formRoles.values })
    }
  }

  const handleCheckRole = e => {
    const val = Number(e.target.value)

    const itemExist = formRoles.values.includes(val)
    if (itemExist) {
      formRoles.resetForm({ values: formRoles.values.filter(i => i !== val) })
    } else {
      formRoles.values.push(val)
      formRoles.resetForm({ values: formRoles.values })
    }
  }

  const handleSaveRoles = async e => {
    e.preventDefault()

    let data = formRoles.values.map((e, i) => {
      return { Id: e }
    })
    setLoading(true)

    try {
      var res = await doPost(`user/updateRoles`, { id: user?.id, roles: data })

      if (res.data && res.data.success) {
        setLoading(false)
        setRolesDialog({ ...rolesDialog, open: false, user: undefined, pageCall: undefined })
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })

        if (pageCall) {
          if (pageCall === 'PDT-AssignUnion') setReload(reload + 1)
          // else if (pageCall === 'BQT-Assignment') setReloadAssign(reloadAssign + 1)
        }
      }
    } catch (err) {
      // Todo:
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const handleCloseDialog = () => {
    if (!loading) {
      setRolesDialog({ ...rolesDialog, open: false, user: undefined, pageCall: undefined })
    }
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="responsive-roles-dialog" fullScreen={fullScreen} maxWidth="lg">
      <DialogTitle>Phân quyền Huynh trưởng</DialogTitle>
      <Divider />
      <DialogContent>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">
                {lstHolyname.find(h => h.id === user?.holyNameId)?.name} {user?.firstName} {user?.lastName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Cấp bậc</FormLabel>
                <FormGroup>
                  <RadioGroup>
                    <FormControlLabel
                      control={<StyledRadio checked={formRoles.values.includes(Roles.DuTruong)} onChange={handleRole} value={Roles.DuTruong} />}
                      label="Dự trưởng"
                    />
                    <FormControlLabel
                      control={<StyledRadio checked={formRoles.values.includes(Roles.HuynhTruong)} onChange={handleRole} value={Roles.HuynhTruong} />}
                      label="Huynh trưởng"
                    />
                  </RadioGroup>
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Chức vụ</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<StyledCheckbox checked={formRoles.values.includes(Roles.PhanDoanTruong)} onChange={handleCheckRole} value={Roles.PhanDoanTruong} disabled />}
                    label="Phân đoàn trưởng"
                  />
                  <FormControlLabel
                    control={<StyledCheckbox checked={formRoles.values.includes(Roles.NganhTruong)} onChange={handleCheckRole} value={Roles.NganhTruong} />}
                    label="Ngành trưởng"
                  />
                  <FormControlLabel
                    control={<StyledCheckbox checked={formRoles.values.includes(Roles.HocTap)} onChange={handleCheckRole} value={Roles.HocTap} />}
                    label="Học tập"
                  />
                  <FormControlLabel
                    control={<StyledCheckbox checked={formRoles.values.includes(Roles.KyLuat)} onChange={handleCheckRole} value={Roles.KyLuat} />}
                    label="Kỷ luật"
                  />
                  <FormControlLabel
                    control={<StyledCheckbox checked={formRoles.values.includes(Roles.PhongTrao)} onChange={handleCheckRole} value={Roles.PhongTrao} />}
                    label="Phong trào"
                  />
                  <FormControlLabel
                    control={<StyledCheckbox checked={formRoles.values.includes(Roles.BanQuanTri)} onChange={handleCheckRole} value={Roles.BanQuanTri} />}
                    label="Ban quản trị"
                    disabled={!sessionHelper().roles.includes(Roles.BanQuanTri)}
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </DialogContent>
      <DialogActions>
        <ButtonLoading btnText="Lưu" loading={loading} handleButtonClick={handleSaveRoles} />
        <Button size="large" onClick={handleCloseDialog} variant="outlined">
          Quay về
        </Button>
      </DialogActions>
    </Dialog>
  )
}
