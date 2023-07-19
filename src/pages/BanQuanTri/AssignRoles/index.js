import React, { Suspense } from 'react'
import { Grid, LinearProgress } from '@material-ui/core'

import UserList from './UserList'
import UserRolesForm from './UserRolesForm'
import SearchBar from './components/SearchBar'

import ChangeUserPasswordDialog from 'components/Dialog/ChangeUserPasswordDialog'
import ChangeUserStatusDialog from 'components/Dialog/ChangeUserStatusDialog'
import UserInfoDialog from 'components/Dialog/UserInfoDialog'
import { useSetRecoilState } from 'recoil'
import { ReloadUserList } from './recoil'
import HeaderAction from './components/HeaderAction'

const UserRoles = () => {
  const setReloadUserList = useSetRecoilState(ReloadUserList)

  return (
    <Suspense fallback={<>Đang tải danh sách HT...</>}>
      <HeaderAction />

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
      <UserInfoDialog reloadUserList={() => setReloadUserList(old => old + 1)} />
    </Suspense>
  )
}
export default UserRoles
