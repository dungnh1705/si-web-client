import React from 'react'
import { useRecoilValue } from 'recoil'
import { Grid } from '@material-ui/core'

import { StudentsQuery, NewUnionIdSelected } from '../recoil'
import StudentsUnion from './StudentsUnion'

const Students = () => {
  const newUnionIdSelected = useRecoilValue(NewUnionIdSelected)
  const studentsUnion = useRecoilValue(StudentsQuery)

  const filter = studentsUnion.filter(su => su.unionId !== newUnionIdSelected)

  return (
    <>
      {filter?.map(
        (union, index) =>
          union.students?.length > 0 && (
            <Grid item xs={12} key={`${union}-${index}`}>
              <StudentsUnion union={union} />
            </Grid>
          )
      )}
    </>
  )
}

export default Students
