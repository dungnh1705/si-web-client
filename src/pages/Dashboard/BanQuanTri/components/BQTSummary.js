import React, { Fragment } from 'react'
import { Grid } from '@material-ui/core'
import { useRecoilValue } from 'recoil'

import GroupInfo from './GroupInfo'
import GroupScoreInfo from './GroupScoreInfo'

// global state
import { groupSummaryQuery } from '../../recoil'

export default function BanQuanTriSummary() {
  const groupSummary = useRecoilValue(groupSummaryQuery)

  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <GroupInfo info={groupSummary} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <GroupScoreInfo info={groupSummary} />
        </Grid>
      </Grid>
    </Fragment>
  )
}
