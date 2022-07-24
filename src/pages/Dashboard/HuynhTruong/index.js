import React, { Fragment } from 'react'
import { useRecoilValue } from 'recoil'

import { Grid } from '@material-ui/core'

import { classSummaryQuery } from '../recoil'
import { AbsentMode } from 'app/enums'

import ClassInfo from './ClassInfo'
import ScoreInfo from './ScoreInfo'
import AbsentInfo from './AbsentInfo'

export default function HuynhTruongDashboard() {
  const classSummary = useRecoilValue(classSummaryQuery)

  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <ClassInfo info={classSummary} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ScoreInfo info={classSummary} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <AbsentInfo info={classSummary} absentMode={AbsentMode.Mass} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <AbsentInfo info={classSummary} absentMode={AbsentMode.Class} />
        </Grid>
      </Grid>
    </Fragment>
  )
}
