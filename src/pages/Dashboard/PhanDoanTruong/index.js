import React, { Fragment } from 'react'
import { Grid } from '@material-ui/core'
import { useRecoilValue } from 'recoil'

// components
import GroupClassInfo from './GroupClassInfo'
import GroupInfo from './GroupInfo'
import GroupScoreInfo from './GroupScoreInfo'
import GroupClassScoreInfo from './GroupClassScoreInfo'
import GroupAbsent from './GroupAbsent'
import GroupClassAbsent from './GroupClassAbsent'

// global state
import { groupSummaryQuery } from '../recoil'

export default function PhanDoanTruongDashboard() {
  const groupSummary = useRecoilValue(groupSummaryQuery)

  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <GroupClassInfo info={groupSummary} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <GroupInfo info={groupSummary} />
        </Grid>

        <Grid item xs={12} lg={4}>
          <GroupScoreInfo info={groupSummary} />
        </Grid>
        <Grid item xs={12} lg={8}>
          <GroupClassScoreInfo info={groupSummary} />
        </Grid>

        <Grid item xs={12} lg={8}>
          <GroupAbsent info={groupSummary} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <GroupClassAbsent info={groupSummary} />
        </Grid>
      </Grid>
    </Fragment>
  )
}
