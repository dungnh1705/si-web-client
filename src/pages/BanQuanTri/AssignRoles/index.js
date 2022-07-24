import React, { Suspense } from 'react'
import { Grid } from '@material-ui/core'
import { SyncLoader } from 'react-spinners'

import UserList from './UserList'
import UserRolesForm from './UserRolesForm'

const UserRoles = () => {
  return (
    <Suspense fallback={<>Đang tải danh sách quyền...</>}>
      <Grid container spacing={3} alignItems="flex-start" justifyContent="center" className="mt-2">
        <Grid container item xs={12} lg={3} alignItems="flex-start" justifyContent="flex-start">
          <Suspense fallback={<SyncLoader color={'#5383ff'} loading={true} />}>
            <UserList />
          </Suspense>
        </Grid>
        <Grid item xs={12} lg={9}>
          <UserRolesForm />
        </Grid>
      </Grid>
    </Suspense>
  )
}
export default UserRoles
