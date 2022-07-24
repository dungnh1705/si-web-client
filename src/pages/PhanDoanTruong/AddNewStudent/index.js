import React from 'react'
import { Grid } from '@material-ui/core'

import RegisterForm from './RegisterForm'

export default function AddNewStudent() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <RegisterForm />
      </Grid>
    </Grid>
  )
}
