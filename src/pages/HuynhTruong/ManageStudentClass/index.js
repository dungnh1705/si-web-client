import React, { Suspense } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { Grid, Typography, ButtonGroup, Button } from '@material-ui/core'
import _ from 'lodash'

import { ViewMode } from 'recoils/atoms'
import { ViewModes } from 'app/enums'
import { AbsentDialog, ChooseInfoFileDialog, DialerDialog, StudentDialog } from 'components/Dialog'

import { StudentsQuery } from './recoil'
import StudentTeam from './StudentTeam'
import HeaderAction from './HeaderAction'

const ManageStudentsClass = () => {
  const lstStudent = useRecoilValue(StudentsQuery)
  const [mode, setMode] = useRecoilState(ViewMode)

  const lstNoTeam = lstStudent?.filter(i => i.team === 0)
  const lstInClass = lstStudent?.filter(i => i.team !== 0)
  const haveStudentNoTeam = _.size(lstNoTeam && lstNoTeam.length > 0 ? lstNoTeam[0].students : []) > 0

  const body = () => {
    return (
      <>
        <Grid container spacing={2} justifyContent='center'>
          {lstStudent && (
            <Grid container item spacing={2}>
              <Grid item xs={10} sm={9}>
                <ButtonGroup variant='contained' aria-label='contained primary button group'>
                  {/*<Button color={mode === ViewModes.DiemDanh ? 'primary' : 'default'} onClick={() => setMode(ViewModes.DiemDanh)}>*/}
                  {/*  Điểm danh*/}
                  {/*</Button>*/}
                  <Button color={mode === ViewModes.DanhSachDS ? 'primary' : 'default'}
                          onClick={() => setMode(ViewModes.DanhSachDS)}>
                    Danh sách
                  </Button>
                  <Button color={mode === ViewModes.XepDoi ? 'primary' : 'default'}
                          onClick={() => setMode(ViewModes.XepDoi)}>
                    Xếp đội
                  </Button>
                </ButtonGroup>
              </Grid>

              <Grid container item xs={2} sm={3} justifyContent='flex-end'>
                <HeaderAction />
              </Grid>
            </Grid>
          )}

          {!lstStudent && (
            <Grid item xs={12}>
              <Typography variant='h4'>Bạn chưa được phân Chi đoàn hoặc chưa có Đoàn sinh trong Chi đoàn.</Typography>
            </Grid>
          )}

          {haveStudentNoTeam &&
            lstNoTeam?.map((item, index) => (
              <Grid item xs={12} lg={4} key={`class-team-${index + 123}`}>
                <StudentTeam item={item} />
              </Grid>
            ))}

          <Grid item xs={12} lg={haveStudentNoTeam ? 8 : 12} container direction='row' spacing={1}>
            {lstInClass?.length > 0 &&
              lstInClass.map((item, index) => (
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

      <>
        <DialerDialog />
        <AbsentDialog />
        <StudentDialog />
        <ChooseInfoFileDialog />
      </>
    </Suspense>
  )
}

export default ManageStudentsClass
