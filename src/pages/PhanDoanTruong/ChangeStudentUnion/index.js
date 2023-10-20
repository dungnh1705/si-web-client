import React from 'react'
import { Grid } from '@material-ui/core'

import { useRecoilValue } from 'recoil'
import { TypeSelected } from './recoil'
import { changeOptionEnum } from 'app/enums'

import HeaderAction from './components/HeaderAction'
import ChangeTeam from './ChangeTeam/ChangeTeam'
import ChangeUnion from './ChangeUnion/ChangeUnion'

const ChangeStudentUnion = () => {
  const typeSelected = useRecoilValue(TypeSelected)
  return (
    <Grid container spacing={2}>
      <HeaderAction key={'Header action'} />

      {typeSelected === changeOptionEnum.Team && <ChangeTeam key={'change Team'} />}

      {typeSelected === changeOptionEnum.Union && <ChangeUnion key={'change Union'} />}
    </Grid>
  )
}

export default ChangeStudentUnion
