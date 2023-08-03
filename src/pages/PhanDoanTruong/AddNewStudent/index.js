import React from 'react'
import { Grid, Hidden } from '@material-ui/core'

import { ChooseInfoFileDialog } from 'components/Dialog'

import RegisterForm from './RegisterForm'
import HeaderAction from './HeaderAction'

export default function AddNewStudent() {
  return (
    <Grid container spacing={2}>
      <Hidden smDown>
        <Grid container item xs={12} spacing={2} className="mt-1" justifyContent="flex-end">
          <HeaderAction />
        </Grid>
      </Hidden>

      <Grid item xs={12}>
        <RegisterForm />
      </Grid>

      <ChooseInfoFileDialog />
    </Grid>
  )
}
