import React from 'react'
import { Grid } from '@material-ui/core'
import { useRecoilValue } from 'recoil'

import { StudentsQuery, NewUnionIdSelected } from '../recoil'
import StudentsUnion from './StudentsUnion'

const Destination = () => {
  const newUnionIdSelected = useRecoilValue(NewUnionIdSelected)
  const studentsUnion = useRecoilValue(StudentsQuery)

  const filter = studentsUnion.find(su => su.unionId === newUnionIdSelected)

  return (
    <>
      {filter && (
        <Grid item xs={12}>
          <StudentsUnion union={filter} isDestination={true} />
        </Grid>
      )}
    </>
  )
}

export default Destination
