import React, { Suspense } from 'react'
import { Grid } from '@material-ui/core'

import ClassList from './ClassList'

const AssignLeader = () => {
  return (
    <Suspense fallback={<>Đang tải danh sách Phân đoàn...</>}>
      <Grid container spacing={2} justifyContent="center" className="mt-2">
        <ClassList />
      </Grid>
    </Suspense>
  )
}

export default AssignLeader
