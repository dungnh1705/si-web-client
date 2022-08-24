import React, { useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Dialog, DialogTitle, DialogContent, Typography, Button, DialogActions, Divider, Grid, TextField, MenuItem } from '@material-ui/core'

import Yup from 'utils/Yup'
import { useFormik } from 'formik'
import ButtonLoading from 'components/UI/ButtonLoading'

import { doPost } from 'utils/axios'
import StringUtils from 'utils/StringUtils'
import sessionHelper from 'utils/sessionHelper'

import { HolyNameQuery, BranchQuery } from 'recoils/selectors'
import { toastState } from 'recoils/atoms'
import { ReloadStudentGroup } from 'pages/PhanDoanTruong/ManageStudentsGroup/recoil'

import { ChangeGroupModalAtom } from './recoil'

export const ChangeGroupModal = () => {
  const lstHolyName = useRecoilValue(HolyNameQuery)
  const lstBranch = useRecoilValue(BranchQuery)

  const setReloadGroup = useSetRecoilState(ReloadStudentGroup)

  const [dialog, setDialog] = useRecoilState(ChangeGroupModalAtom)
  const [toast, setToast] = useRecoilState(toastState)

  const [loading, setLoading] = useState(false)
  const { openDialog, student, closeParent } = dialog

  const currentGroupId = student?.studentClass[0]?.class?.groupId

  const validationSchema = Yup.object({
    studentId: Yup.string().required('Không để trống'),
    newGroupId: Yup.string().required('Không để trống'),
    note: Yup.string().required('Không để trống')
  })

  const changeForm = useFormik({
    initialValues: { studentId: student?.id },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    enableReinitialize: true,
    initialErrors: { newGroupId: 'Required' }
  })

  const TextField_Props = (name, label) => {
    const { values, errors, touched, handleChange } = changeForm
    return {
      name,
      label,
      fullWidth: true,
      variant: 'outlined',
      error: errors[name] && touched[name],
      helperText: errors[name] && touched[name] && errors[name],
      InputLabelProps: { shrink: true },
      value: values[name] ?? '',
      onChange: handleChange
    }
  }

  const handleClose = (close = false) => {
    setDialog({ ...dialog, openDialog: false, student: undefined, closeParent: close })
  }

  const onChangeBranch = e => {
    e.preventDefault()
    changeForm.setFieldValue('stuBranchId', e.target.value)

    const tmp = lstBranch.find(g => g.branchId === e.target.value).group
    const filter = tmp.filter(t => t.groupId !== currentGroupId)

    changeForm.setFieldValue('newGroupId', filter.length > 0 ? filter[0].groupId : undefined)
  }

  const handleChangeGroup = async () => {
    setLoading(true)
    const { scholasticId, userId, classId } = sessionHelper()

    const data = {
      ...changeForm.values,
      scholasticId,
      userId,
      currentGroupId,
      classId
    }

    try {
      let res = await doPost(`student/changeStudentGroup`, data)
      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        handleClose(true)
        setReloadGroup(old => old + 1)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={openDialog} onClose={handleClose}>
      <DialogTitle>Chuyển Phân đoàn</DialogTitle>
      <Divider />
      <DialogContent style={{ minWidth: '300px' }}>
        <div style={{ padding: '10px', textAlign: 'center' }}>
          <Typography>Bạn đang thực hiện chuyển Phân Đoàn cho Đoàn sinh</Typography>
          <br />
          <Typography variant="h4">
            {StringUtils.holyNameLookup(lstHolyName, student?.stuHolyId)} {student?.stuFirstName} {student?.stuLastName}
          </Typography>
          <br />
          <Grid container item spacing={2}>
            <Grid item xs={6}>
              <TextField select {...TextField_Props('stuBranchId', 'Ngành mới')} onChange={onChangeBranch}>
                {lstBranch
                  ?.filter(b => b.branchId !== 'NON')
                  .map((branch, i) => (
                    <MenuItem key={branch.branchName} value={branch.branchId}>
                      {branch.branchName}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select {...TextField_Props('newGroupId', 'Phân đoàn mới')}>
                {lstBranch
                  ?.find(g => g.branchId === changeForm.values['stuBranchId'])
                  ?.group.filter(t => t.groupId !== currentGroupId)
                  .map((group, i) => (
                    <MenuItem key={`group-${group.groupName}`} value={group.groupId}>
                      {group.groupName}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField {...TextField_Props('note', 'Lý do')} />
            </Grid>
          </Grid>
          <br />
          <Typography variant="h6" color="error">
            SAU KHI CHUYỂN THÔNG TIN ĐOÀN SINH SẼ KHÔNG CÒN TRONG PHÂN ĐOÀN!
          </Typography>
          <Typography variant="h6" color="error">
            BẠN CÓ CHẮC CHẮN CHƯA?
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Grid container item spacing={2} justifyContent="flex-end">
          <Grid item xs={6}>
            <ButtonLoading btnText="Chuyển" loading={loading} handleButtonClick={handleChangeGroup} disabled={!changeForm.isValid} />
          </Grid>
          <Grid item xs={6}>
            <Button size="large" onClick={handleClose} variant="outlined" fullWidth>
              Quay về
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}
