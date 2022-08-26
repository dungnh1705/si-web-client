import React, { Suspense, useEffect } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { Grid, Typography, ButtonGroup, Button } from '@material-ui/core'
import _ from 'lodash'

import { AbsentDialog, StudentDialog, DialerDialog, ChooseInfoFileDialog, ChangeGroupModal } from 'components/Dialog'
import { ViewModes } from 'app/enums'
import { ViewMode, PageYOffset } from 'recoils/atoms'

import { StudentsGroupQuery } from './recoil'
import StudentGroup from './StudentGroup'
import HeaderAction from './HeaderAction'

const ManageStudentsGroup = () => {
  const lstStudent = useRecoilValue(StudentsGroupQuery)
  const positionY = useRecoilValue(PageYOffset)

  const [mode, setMode] = useRecoilState(ViewMode)

  const lstNoUnion = lstStudent?.filter(i => i.unionId === 1)
  const lstInGroup = lstStudent?.filter(i => i.unionId !== 1)
  const haveStudentNoUnion = _.size(lstNoUnion ? lstNoUnion[0].students : []) > 0

  useEffect(() => {
    window.scroll(0, positionY)
  }, [lstStudent])

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
            <Grid item xs={12} lg={4} key="group-class-no-union">
              <StudentGroup item={item} />
            </Grid>
          ))}

        <Grid container item xs={12} lg={haveStudentNoUnion ? 8 : 12} direction="row" spacing={1}>
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

      <>
        <StudentDialog />
        <AbsentDialog />
        <DialerDialog />
        <ChooseInfoFileDialog />
        <ChangeGroupModal />
      </>
    </Suspense>
  )
}

export default ManageStudentsGroup
