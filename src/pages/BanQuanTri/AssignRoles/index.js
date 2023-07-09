import React, { Suspense } from 'react'
import { Grid, LinearProgress } from '@material-ui/core'

import UserList from './UserList'
import UserRolesForm from './UserRolesForm'
import SearchBar from './components/SearchBar'

const UserRoles = () => {
  return (
    <Suspense fallback={<>Đang tải danh sách HT...</>}>
      <Grid container spacing={3} alignItems="flex-start" justifyContent="center" className="mt-2">
        <Grid container item xs={12} justifyContent={'flex-start'} alignItems={'center'}>
          <SearchBar />
        </Grid>
        <Grid item xs={12}>
          <Suspense fallback={<LinearProgress />}>
            <UserList />
          </Suspense>
        </Grid>
        {/*<Grid item xs={12} lg={9}>*/}
        {/*  <UserRolesForm />*/}
        {/*</Grid>*/}
      </Grid>
    </Suspense>
  )
}
export default UserRoles
