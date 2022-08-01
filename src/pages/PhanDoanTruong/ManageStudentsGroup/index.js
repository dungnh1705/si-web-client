import React, { Suspense } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { Grid, Typography, ButtonGroup, Button } from '@material-ui/core'
import _ from 'lodash'

import { AbsentDialog, StudentDialog, DialerDialog } from 'components/Dialog'
import ModalSkeleton from 'components/Loading/modal-skeleton'
import { ViewModes } from 'app/enums'
import { ViewMode } from 'recoils/atoms'

import { StudentsGroupQuery } from './recoil'
import StudentGroup from './StudentGroup'
import HeaderAction from './HeaderAction'

const ManageStudentsGroup = () => {
  const lstStudent = useRecoilValue(StudentsGroupQuery)
  const [mode, setMode] = useRecoilState(ViewMode)

  const lstNoUnion = lstStudent?.filter(i => i.unionId === 1)
  const lstInGroup = lstStudent?.filter(i => i.unionId !== 1)
  const haveStudentNoUnion = _.size(lstNoUnion ? lstNoUnion[0].students : []) > 0

  const body = () => {
    return (
      <Grid container spacing={1}>
        {lstStudent && (
          <Grid container spacing={1}>
            <Grid item xs={10} sm={9}>
              <ButtonGroup variant="contained" aria-label="contained primary button group">
                <Button color={mode === ViewModes.DiemDanh ? 'primary' : 'default'} onClick={() => setMode(ViewModes.DiemDanh)}>
                  Điểm danh
                </Button>
                <Button color={mode === ViewModes.XepChiDoan ? 'primary' : 'default'} onClick={() => setMode(ViewModes.XepChiDoan)}>
                  Xếp Chi đoàn
                </Button>
                <Button color={mode === ViewModes.DanhSachNghi ? 'primary' : 'default'} onClick={() => setMode(ViewModes.DanhSachNghi)}>
                  Danh sách nghỉ
                </Button>
              </ButtonGroup>
            </Grid>

            <Grid container item xs={2} sm={3} justifyContent="flex-end">
              <HeaderAction />
            </Grid>
          </Grid>
        )}

        {!lstStudent && (
          <Grid container item spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h4">Chưa có Đoàn sinh trong Phân đoàn.</Typography>
            </Grid>
          </Grid>
        )}

        {haveStudentNoUnion &&
          lstNoUnion.map(item => (
            <Grid item xs={12} lg={3} key="group-class-no-union">
              <StudentGroup item={item} />
            </Grid>
          ))}

        <Grid container item xs={12} lg={haveStudentNoUnion ? 9 : 12} direction="row" spacing={1}>
          {lstInGroup?.map(item => (
            <Grid item xs={12} lg={haveStudentNoUnion ? 12 : 6} key={`group-class-union-${item.unionId}`}>
              <StudentGroup item={item} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    )
  }

  return (
    <Suspense fallback={<>Đang tải Danh sách Đoàn sinh ...</>}>
      {body()}
      <Suspense fallback={<ModalSkeleton />}>
        <StudentDialog />
        <AbsentDialog />
        <DialerDialog />
      </Suspense>
    </Suspense>
  )
}

export default ManageStudentsGroup
