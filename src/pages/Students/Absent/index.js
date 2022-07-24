import React, { Fragment, Suspense, useEffect } from 'react'
import { Grid, TextField, MenuItem, InputAdornment, Card, Typography } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'

import ModalSkeleton from 'components/Loading/modal-skeleton'
import sessionHelper from 'utils/sessionHelper'
import { Roles } from 'app/enums'
import { UnionQuery } from 'recoils/selectors'

import { LoadStudentAbsent, UnionCodeFilter } from './recoil'
import AbsentForm from './AbsentForm'
import StudentAbsent from './StudentAbsent'
import ConfirmDialog from './ConfirmDialog'
import HeaderAction from './HeaderAction'

const ManageAbsent = () => {
  const lstUnion = useRecoilValue(UnionQuery)
  const lstAbsent = useRecoilValue(LoadStudentAbsent)
  const [unionFilter, setUnionFilter] = useRecoilState(UnionCodeFilter)

  useEffect(() => {
    // Lấy chi đoàn của Kỷ luật
    if (sessionHelper().roles.includes(Roles.KyLuat)) {
      let unionCode = lstUnion?.find(u => Number(u.unionId) === Number(sessionHelper().unionId))?.unionCode
      if (unionCode) setUnionFilter(unionCode)
    }
  }, [])

  const body = () => {
    return (
      <Fragment>
        <Grid container spacing={3} justifyContent="flex-start" alignItems="center">
          <Grid container item xs={9}>
            {(sessionHelper().roles.includes(Roles.PhanDoanTruong) || sessionHelper().roles.includes(Roles.KyLuat)) && (
              <Grid>
                <Card>
                  <TextField
                    variant="outlined"
                    fullWidth
                    select
                    InputProps={{
                      startAdornment: <InputAdornment position="start">CĐ:</InputAdornment>
                    }}
                    value={unionFilter}
                    onChange={e => setUnionFilter(e.target.value)}>
                    {lstUnion?.map((option, i) => {
                      return (
                        <MenuItem key={`union-${i * 55}`} value={option.unionCode}>
                          {option.unionCode}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </Card>
              </Grid>
            )}
          </Grid>
          <Grid container item xs={3} justifyContent="flex-end" alignItems="center">
            <HeaderAction />
          </Grid>
        </Grid>

        {lstAbsent?.length === 0 && (
          <Grid container item spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4">Chưa có danh sách ngày nghỉ của Đoàn sinh.</Typography>
            </Grid>
          </Grid>
        )}

        {lstAbsent?.length > 0 && (
          <Grid container spacing={3} className="mt-3">
            {lstAbsent.map((ab, index) => {
              return <StudentAbsent month={ab} key={`class-absent-${ab.year}-${index}`} />
            })}
          </Grid>
        )}
      </Fragment>
    )
  }

  return (
    <Suspense fallback={<>Đang tải danh sách ngày nghỉ...</>}>
      {body()}
      <Suspense fallback={<ModalSkeleton />}>
        <AbsentForm />
        <ConfirmDialog />
      </Suspense>
    </Suspense>
  )
}

export default ManageAbsent
