import React from 'react'
import { Grid, TextField, MenuItem, Button } from '@material-ui/core'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos'

import { toastState } from 'recoils/atoms'
import { UnionQuery } from 'recoils/selectors'

import { NewUnionIdSelected, StudentSelected, ReloadStudents } from '../recoil'
import sessionHelper from 'utils/sessionHelper'
import { doPost } from 'utils/axios'

const Transition = () => {
  const unions = useRecoilValue(UnionQuery)

  const setReloadStudents = useSetRecoilState(ReloadStudents)

  const [newUnionId, setNewUnionId] = useRecoilState(NewUnionIdSelected)
  const [studentIds, setStudentIds] = useRecoilState(StudentSelected)
  const [toast, setToast] = useRecoilState(toastState)

  const handleChangeUnion = e => {
    setNewUnionId(e.target.value)
    setStudentIds([])
  }

  const handleButtonClick = async () => {
    const { classId, userId, scholasticId } = sessionHelper()

    const data = {
      studentIds,
      scholasticId,
      classId,
      newUnionId,
      userId
    }

    try {
      const res = await doPost('student/updateStudentsUnion', data)
      if (res && res.data.success) {
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setReloadStudents(reload => reload + 1)
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    } finally {
    }
  }

  return (
    <Grid container item xs={12} alignContent="flex-start" spacing={2}>
      <Grid item xs={12}>
        <TextField variant="outlined" fullWidth select label="CĐ mới" onChange={handleChangeUnion}>
          {unions?.map(union => {
            return (
              <MenuItem key={`new-union-${union.unionId}`} value={union.unionId}>
                {union.unionCode}
              </MenuItem>
            )
          })}
        </TextField>
      </Grid>

      <Grid container item xs={12} justifyContent="center">
        <Button size="large" color="primary" variant="contained" onClick={handleButtonClick} disabled={!newUnionId || studentIds.length === 0}>
          <ArrowForwardIos />
        </Button>
      </Grid>
    </Grid>
  )
}

export default Transition
