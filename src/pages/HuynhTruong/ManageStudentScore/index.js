import React, { Suspense, useEffect } from 'react'
import { Grid, Typography, ButtonGroup, Button, Hidden } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'

import { PageYOffset } from 'recoils/atoms'

import { StudentListQuery, WorkingSemester } from './recoil'
import HeaderAction from './HeaderAction'
import StudentTeam from './StudentTeam'

import { ScoreDownloadDialog, ChooseFileDialog } from 'components/Dialog'
import ModalSkeleton from 'components/Loading/modal-skeleton'
import { Semester } from 'app/enums'

const ManageStudentScore = () => {
  const lstStudent = useRecoilValue(StudentListQuery)
  const positionY = useRecoilValue(PageYOffset)

  const [workingSemester, setWorkingSemester] = useRecoilState(WorkingSemester)

  useEffect(() => {
    window.scroll(0, positionY)
  }, [lstStudent, positionY])

  const body = () => {
    return (
      <Grid container spacing={2}>
        {(!lstStudent || lstStudent?.length === 0) && (
          <Grid item xs={12}>
            <Typography variant="h4">Bạn chưa được phân Chi đoàn hoặc chưa có Đoàn sinh trong Chi đoàn.</Typography>
          </Grid>
        )}

        {lstStudent?.length > 0 && (
          <>
            <Grid item xs={12} sm={9}>
              <ButtonGroup variant="contained" aria-label="contained primary button group">
                {Semester.map(s => (
                  <Button key={s.Id} color={workingSemester === s.Id ? 'primary' : 'default'} onClick={() => setWorkingSemester(s.Id)}>
                    {s.Name}
                  </Button>
                ))}
              </ButtonGroup>
            </Grid>

            <Hidden xsDown>
              <Grid container item sm={3} justifyContent="flex-end">
                <HeaderAction />
              </Grid>
            </Hidden>

            {lstStudent.map(team => (
              <StudentTeam team={team} key={`score-team${team.team}`} />
            ))}
          </>
        )}
      </Grid>
    )
  }

  return (
    <Suspense fallback={<div>Đang tải danh sách điểm Đoàn sinh...</div>}>
      {body()}
      <Suspense fallback={<ModalSkeleton />}>
        <ScoreDownloadDialog />
        <ChooseFileDialog />
      </Suspense>
    </Suspense>
  )
}

export default ManageStudentScore
