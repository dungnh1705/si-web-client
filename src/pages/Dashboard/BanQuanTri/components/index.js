import React, { Fragment } from 'react'
import { Grid } from '@material-ui/core'
import { useRecoilValue } from 'recoil'

import sessionHelper from 'utils/sessionHelper'
import { selectedClass } from 'pages/Dashboard/recoil'

// global state
import PhanDoanTruongDashboard from 'pages/Dashboard/PhanDoanTruong'
import BanQuanTriSummary from 'pages/Dashboard/BanQuanTri/components/BQTSummary'

export default function BanQuanTriMainDashboard() {
  const selected = useRecoilValue(selectedClass)
  const { classId } = sessionHelper()

  return (
    <Fragment>
      <Grid container spacing={3}>
        {selected?.id === classId && <PhanDoanTruongDashboard />}
        {selected?.id !== classId && <BanQuanTriSummary />}
      </Grid>
    </Fragment>
  )
}
