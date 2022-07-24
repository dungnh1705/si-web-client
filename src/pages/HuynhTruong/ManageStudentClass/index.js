import React, { Suspense } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { Grid, Typography, ButtonGroup, Button } from '@material-ui/core'
import _ from 'lodash'

import { ViewMode } from 'recoils/atoms'
import { ViewModes } from 'app/enums'
import { AbsentDialog, DialerDialog, StudentDialog } from 'components/Dialog'
import ModalSkeleton from 'components/Loading/modal-skeleton'

import { StudentsQuery } from './recoil'
import StudentTeam from './StudentTeam'

const ManageStudentsClass = () => {
  const lstStudent = useRecoilValue(StudentsQuery)
  const [mode, setMode] = useRecoilState(ViewMode)

  const lstNoTeam = lstStudent?.filter(i => i.team === 0)
  const lstInClass = lstStudent?.filter(i => i.team !== 0)
  const haveStudentNoTeam = _.size(lstNoTeam ? lstNoTeam[0].students : []) > 0

  const body = () => {
    return (
      <>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {lstStudent && (
            <Grid container item spacing={2}>
              <Grid item xs={12} lg={9}>
                <ButtonGroup variant="contained" aria-label="contained primary button group">
                  <Button color={mode === ViewModes.DiemDanh ? 'primary' : 'default'} onClick={() => setMode(ViewModes.DiemDanh)}>
                    Điểm danh
                  </Button>
                  <Button color={mode === ViewModes.XepDoi ? 'primary' : 'default'} onClick={() => setMode(ViewModes.XepDoi)}>
                    Xếp đội
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          )}

          {!lstStudent && (
            <Grid item xs={12}>
              <Typography variant="h4">Bạn chưa được phân Chi đoàn hoặc chưa có Đoàn sinh trong Chi đoàn.</Typography>
            </Grid>
          )}

          {haveStudentNoTeam &&
            lstNoTeam?.map((item, index) => (
              <Grid item xs={12} lg={3} key={`class-team-${index + 123}`}>
                <StudentTeam item={item} />
              </Grid>
            ))}

          <Grid item xs={12} lg={haveStudentNoTeam ? 9 : 12} container direction="row" spacing={1}>
            {lstInClass?.map((item, index) => (
              <Grid item xs={12} lg={haveStudentNoTeam ? 12 : 6} key={`class-teams-${index + item.team}`}>
                <StudentTeam item={item} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </>
    )
  }

  return (
    <Suspense fallback={<>Đang tải danh sách Đoàn sinh ...</>}>
      {body()}
      <Suspense fallback={<ModalSkeleton />}>
        <DialerDialog />
        <AbsentDialog />
        <StudentDialog />
      </Suspense>
    </Suspense>
  )
}

export default ManageStudentsClass
