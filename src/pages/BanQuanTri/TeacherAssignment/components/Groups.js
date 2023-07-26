import React from 'react'
import { Grid } from '@material-ui/core'

import { useRecoilValue } from 'recoil'

import { ClassSelector } from '../recoil'
import { nanoid } from 'nanoid'
import GroupInfo from './GroupInfo'

export default function Groups() {
  const classes = useRecoilValue(ClassSelector)

  return (
    <Grid container spacing={3} justifyContent={'flex-start'} alignItems={'center'}>
      {classes?.map((item, index) => (
        <Grid container spacing={3} item xs={12} key={`class-${nanoid(3)}`} justifyContent={'flex-start'} alignItems={'center'}>
          <GroupInfo info={item} />
        </Grid>
      ))}
    </Grid>
  )
}
