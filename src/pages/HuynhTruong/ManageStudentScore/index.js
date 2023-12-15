import React, { Suspense } from 'react'
import { Grid, ButtonGroup, Button, Hidden } from '@material-ui/core'
import { useRecoilState } from 'recoil'

import { Semester } from 'app/enums'
import { ChooseFileDialog, GroupScoreResultDialog } from 'components/Dialog'

import { SemesterSelected } from './recoil'
import HeaderAction from './HeaderAction'

import UnionTeams from './UnionTeams'

import PageSkeleton from 'components/Loading/page-skeleton'

const ManageStudentScore = () => {
  const [semester, setSemester] = useRecoilState(SemesterSelected)

  const Body = () => {
    return (
      <div>
        <Grid container spacing={2}>
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
        </Grid>

        <br />
        <Suspense fallback={<PageSkeleton />}>
          <UnionTeams />
        </Suspense>
      </div>
    )
  }
  return (
    <Suspense fallback={<>Đang tải Danh sách điểm ...</>}>
      <Body />

      <ChooseFileDialog />
      <GroupScoreResultDialog />
    </Suspense>
  )
}

export default ManageStudentScore
