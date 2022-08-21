import React from 'react'
import { useRecoilValue } from 'recoil'
import { Grid } from '@material-ui/core'

import { StudentsQuery } from '../recoil'
import StudentsUnion from './StudentsUnion'

const Students = () => {
  const studentsUnion = useRecoilValue(StudentsQuery)

  return (
    <>
      {studentsUnion?.map((union, index) => (
        <Grid item xs={12} key={`${union}-${index}`}>
          <StudentsUnion union={union} />
        </Grid>
      ))}
    </>
  )
}

export default Students
