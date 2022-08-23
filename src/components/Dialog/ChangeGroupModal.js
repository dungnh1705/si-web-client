import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Dialog, DialogTitle, DialogContent, Typography, Button, DialogActions, Divider, Grid, TextField, MenuItem } from '@material-ui/core'

import Yup from 'utils/Yup'
import { useFormik } from 'formik'
import { HolyNameQuery, BranchQuery } from 'recoils/selectors'

import { ChangeGroupModalAtom } from './recoil'
import StringUtils from 'utils/StringUtils'

export const ChangeGroupModal = () => {
  const lstHolyName = useRecoilValue(HolyNameQuery)
  const lstBranch = useRecoilValue(BranchQuery)

  const [dialog, setDialog] = useRecoilState(ChangeGroupModalAtom)
  const { openDialog, student } = dialog

  const currentGroupId = student?.studentClass[0]?.class?.groupId

  const validationSchema = Yup.object({
    studentId: Yup.string().required('Không để trống'),
    newGroupId: Yup.string().required('Không để trống')
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

  const handleClose = () => {
    setDialog({ ...dialog, openDialog: false, student: undefined })
  }

  const onChangeBranch = e => {
    e.preventDefault()
    changeForm.setFieldValue('stuBranchId', e.target.value)

    const tmp = lstBranch.find(g => g.branchId === e.target.value).group
    changeForm.setFieldValue('newGroupId', tmp.filter(t => t.groupId !== currentGroupId)[0].groupId)
  }

  const handleChangeGroup = () => {
    console.log(changeForm.values)
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
          </Grid>
          <br />
          <Typography variant="h6" color="error">
            SAU KHI CHUYỂN THÔNG TIN ĐOÀN SINH SẼ KHÔNG CÒN TRONG PHÂN ĐOÀN NỮA!
          </Typography>
          <Typography variant="h6" color="error">
            BẠN CÓ CHẮC CHẮN CHƯA?
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Grid container item spacing={2} justifyContent="flex-end">
          <Grid item xs={6}>
            <Button size="large" onClick={handleChangeGroup} color="primary" variant="contained" fullWidth disabled={!changeForm.isValid}>
              Chuyển
            </Button>
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
