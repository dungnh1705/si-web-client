import React, { Fragment } from 'react'
import { Grid } from '@material-ui/core'
import { useRecoilValue } from 'recoil'

import sessionHelper from 'utils/sessionHelper'

import { selectedClass } from 'pages/Dashboard/recoil'
import GroupInfo from './GroupInfo'
import GroupScoreInfo from './GroupScoreInfo'

// global state
import { groupSummaryQuery } from '../../recoil'
import PhanDoanTruongDashboard from 'pages/Dashboard/PhanDoanTruong'

export default function BanQuanTriDashboard() {
  const groupSummary = useRecoilValue(groupSummaryQuery)
  const selected = useRecoilValue(selectedClass)
  const { classId } = sessionHelper()

  return (
    <Fragment>
      <Grid container spacing={3}>
        {selected.id === classId && <PhanDoanTruongDashboard />}
        {selected.id !== classId && (
          <>
            <Grid item xs={12} lg={8}>
              <GroupInfo info={groupSummary} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <GroupScoreInfo info={groupSummary} />
            </Grid>
          </>
        )}
      </Grid>
    </Fragment>
  )
}
