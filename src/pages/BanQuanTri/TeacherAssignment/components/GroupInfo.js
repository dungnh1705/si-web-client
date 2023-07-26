import React, { Suspense } from 'react'
import { Card, CardContent, Divider, Grid, LinearProgress } from '@material-ui/core'

import GroupLeader from './GroupLeader'
import GroupMember from './GroupMember'

export default function GroupInfo({ info }) {
  return (
    <Card className="card-box mb-3 w-100">
      <div className="card-header">
        <div className="card-header--title">
          <h4 className="font-size-lg mb-0 py-2 font-weight-bold">{info.group.groupName}</h4>
        </div>
      </div>
      <Divider />
      <CardContent>
        <Grid container spacing={3} justifyContent={'flex-start'} alignItems={'center'}>
          <Grid item xs={12} lg={3}>
            <Suspense fallback={<LinearProgress />}>
              <GroupLeader info={info} />
            </Suspense>
          </Grid>
          <Grid item xs={12} lg={9}>
            <Suspense fallback={<LinearProgress />}>
              <GroupMember />
            </Suspense>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
