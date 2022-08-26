import React, { Suspense } from 'react'
import { Grid } from '@material-ui/core'

import CardSkeleton from 'components/Loading/card-skeleton'

import Students from './components/Students'
import Transition from './components/Transition'
import Destination from './components/Destination'

const ChangeStudentUnion = () => {
  return (
    <Grid container spacing={2}>
      <Grid container item spacing={2} xs={12} md={5}>
        <Suspense fallback={<CardSkeleton />}>
          <Students />
        </Suspense>
      </Grid>

      <Grid container item spacing={2} xs={12} md={2} justifyContent="center">
        <Suspense fallback={<>Tải danh sách Chi đoàn ...</>}>
          <Transition />
        </Suspense>
      </Grid>

      <Grid container item spacing={2} xs={12} md={5}>
        <Suspense fallback={<CardSkeleton />}>
          <Destination />
        </Suspense>
      </Grid>
    </Grid>
  )
}

export default ChangeStudentUnion
