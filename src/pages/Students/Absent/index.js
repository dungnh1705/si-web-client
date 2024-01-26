import React, { Fragment, Suspense } from 'react'
import { Grid, LinearProgress } from '@material-ui/core'
import { useRecoilValue } from 'recoil'

import { GetTeamsInUnionQuery } from './recoil'
import StudentAttendance from './StudentAttendance'
import HeaderAction from './HeaderAction'
import AbsentForm from './AbsentForm'

const ManageAbsent = () => {
  const teams = useRecoilValue(GetTeamsInUnionQuery)

  return (
    <Grid container spacing={3} className="mt-2">
      <Suspense fallback={<LinearProgress />}>
        <HeaderAction />
      </Suspense>

      <Suspense fallback={<LinearProgress />}>
        {teams.map(team => (
          <StudentAttendance team={team} key={`absent-team-${team.team}`} />
        ))}
      </Suspense>

      <Fragment>
        <AbsentForm />
      </Fragment>
    </Grid>
  )
}

export default ManageAbsent
