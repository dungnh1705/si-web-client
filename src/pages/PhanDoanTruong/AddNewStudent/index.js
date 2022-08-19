import React from 'react'
import { Grid, Hidden } from '@material-ui/core'

import { ChooseInfoFileDialog } from 'components/Dialog'

import RegisterForm from './RegisterForm'
import HeaderAction from './HeaderAction'

export default function AddNewStudent() {
  return (
    <Grid container spacing={3}>
      <Hidden smDown>
        <Grid container spacing={3} style={{ marginTop: '5px' }}>
          <Grid container item sm={12} justifyContent="flex-end">
            <HeaderAction />
          </Grid>
        </Grid>
      </Hidden>

      <Grid item xs={12}>
        <RegisterForm />
      </Grid>

      <ChooseInfoFileDialog />
    </Grid>
  )
}
