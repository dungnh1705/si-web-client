import React, { Suspense } from 'react'
import { Grid, LinearProgress } from '@material-ui/core'

import UserList from './UserList'
import UserRolesForm from './UserRolesForm'
import SearchBar from './components/SearchBar'
import ChangeUserPasswordDialog from 'components/Dialog/ChangeUserPasswordDialog'
import ChangeUserStatusDialog from 'components/Dialog/ChangeUserStatusDialog'

const UserRoles = () => {
  return (
    <Suspense fallback={<>Đang tải danh sách HT...</>}>
      <SearchBar />

      <Grid container spacing={3} alignItems="flex-start" justifyContent="center" className="mt-2">
        <Grid item xs={12}>
          <Suspense fallback={<LinearProgress />}>
            <UserList />
          </Suspense>
        </Grid>
        {/*<Grid item xs={12} lg={9}>*/}
        {/*  <UserRolesForm />*/}
        {/*</Grid>*/}
      </Grid>

      <ChangeUserPasswordDialog />
      <ChangeUserStatusDialog />
    </Suspense>
  )
}
export default UserRoles
