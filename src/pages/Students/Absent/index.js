import React, { Suspense, useEffect } from 'react'
import {
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Card,
  Typography, LinearProgress
} from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'

import sessionHelper from 'utils/sessionHelper'
import { Roles } from 'app/enums'
import { UnionQuery } from 'recoils/selectors'

import { UnionCodeFilter, AbsentUnionSelected, StudentListQuery } from './recoil'
import StudentAttendance from './StudentAttendance'
import { PageYOffset } from 'recoils/atoms'

const ManageAbsent = () => {
  const lstUnion = useRecoilValue(UnionQuery)
  const lstStudent = useRecoilValue(StudentListQuery)


  const [unionFilter, setUnionFilter] = useRecoilState(UnionCodeFilter)
  const [, setUnionSelected] = useRecoilState(AbsentUnionSelected)

  const positionY = useRecoilValue(PageYOffset)

  useEffect(() => {
    // get uninon of roles ky luat and hoc tap at first
    if (sessionHelper().roles.includes(Roles.KyLuat) || sessionHelper().roles.includes(Roles.HocTap)) {
      let unionCode = lstUnion?.find(u => Number(u.unionId) === Number(sessionHelper().unionId))?.unionCode
      if (unionCode) setUnionFilter(unionCode)
    }

    // Set the default union appearing first for role phan doan truong
    if (sessionHelper().roles.includes(Roles.PhanDoanTruong)) {
      setUnionFilter(1)
      setUnionSelected(lstUnion[0].unionId)
    } else {
      setUnionSelected(sessionHelper().unionId)
    }
  }, [])

  useEffect(() => {
    window.scroll(0, positionY)
  }, [lstStudent, positionY])

  const canShowListUnion = () => {
    return sessionHelper().roles.includes(Roles.PhanDoanTruong) || sessionHelper().roles.includes(Roles.KyLuat) || sessionHelper().roles.includes(Roles.HocTap)
  }

  const handleChange = (e) => {
    const value = e.target.value

    setUnionFilter(value)
    setUnionSelected(lstUnion.find(union => union.unionCode === value).unionId)
  }

  const body = () => {
    return (
      <Grid container spacing={3} className='mt-2'>
        {(!lstStudent || lstStudent?.length === 0) && (
          <Grid item xs={12}>
            <Typography variant='h4'>Bạn chưa được phân Chi đoàn hoặc chưa có Đoàn sinh trong Chi đoàn.</Typography>
          </Grid>
        )}

        <Grid item container spacing={3} justifyContent='flex-start' alignItems='center'>
          <Grid item xs={6} sm={2}>
            {canShowListUnion() && (
              <Card>
                <TextField
                  variant='outlined'
                  fullWidth
                  select
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>Chi đoàn:</InputAdornment>
                  }}
                  value={unionFilter}
                  onChange={e => handleChange(e)}>
                  {lstUnion?.map((option, i) => {
                    return (
                      <MenuItem key={`absent-union-${option.unionId}`} value={option.unionCode}>
                        {option.unionCode}
                      </MenuItem>
                    )
                  })}
                </TextField>
              </Card>
            )}
          </Grid>
        </Grid>

        {lstStudent?.map(team => (
          <Suspense fallback={<LinearProgress />} key={`absent-team-${team.team}`}>
            <StudentAttendance team={team} />
          </Suspense>
        ))}

      </Grid>
    )
  }

  return (
    <Suspense fallback={<>Đang tải danh sách ngày nghỉ...</>}>
      {body()}
    </Suspense>
  )
}

export default ManageAbsent
