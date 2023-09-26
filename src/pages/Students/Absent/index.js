import React, { Suspense, useEffect } from 'react'
import { Grid, LinearProgress } from '@material-ui/core'
import { useRecoilValue } from 'recoil'

import { GetTeamsInUnionQuery } from './recoil'
import StudentAttendance from './StudentAttendance'
import HeaderAction from './HeaderAction'

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
    </Grid>
  )
}

export default ManageAbsent
