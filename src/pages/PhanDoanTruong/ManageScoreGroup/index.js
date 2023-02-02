import React, { Suspense } from 'react'
import { Grid, ButtonGroup, Button, Hidden, Typography } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'

import { v4 as uuidv4 } from 'uuid'
import { Semester } from 'app/enums'
import { DocumentPreviewDialog, ChooseFileDialog, GroupScoreResultDialog } from 'components/Dialog'

import { SemesterSelected, StudentsGroupScore } from './recoil'
import StudentUnion from './StudentUnion'
import HeaderAction from './HeaderAction'

const ManageScoreGroup = () => {
  const lstStuScore = useRecoilValue(StudentsGroupScore)

  const [semester, setSemester] = useRecoilState(SemesterSelected)

  const body = () => {
    return (
      <Grid container spacing={2}>
        {lstStuScore && (
          <>
            <Grid item xs={12} sm={9}>
              <ButtonGroup variant="contained" aria-label="contained primary button group">
                {Semester.map(s => (
                  <Button key={s.Id} color={semester === s.Id ? 'primary' : 'default'} onClick={() => setSemester(s.Id)}>
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

            {lstStuScore.map(u => (
              <Grid key={`score-group-${uuidv4()}`} item xs={12}>
                <StudentUnion union={u} />
              </Grid>
            ))}
          </>
        )}

        {!lstStuScore && (
          <Grid container item spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4">Chưa có Đoàn sinh trong Phân đoàn</Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    )
  }
  return (
    <Suspense fallback={<>Đang tải Danh sách điểm ...</>}>
      {body()}

      {/* DIALOG */}
      <DocumentPreviewDialog />
      <ChooseFileDialog />
      <GroupScoreResultDialog />
    </Suspense>
  )
}

export default ManageScoreGroup
