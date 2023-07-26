import React, { Fragment, Suspense } from 'react'
import { LinearProgress } from '@material-ui/core'
import Groups from './components/Groups'

export default function TeacherAssignment() {
  return (
    <Fragment>
      <Suspense fallback={<LinearProgress />}>
        <div className="mt-4">
          <Groups />
        </div>
      </Suspense>
    </Fragment>
  )
}
