import React from 'react'
import { useRecoilValue } from 'recoil'
import { renderRoutes } from 'react-router-config'

import { history } from 'App'
import LeftSideBar from './LeftSideBar'

import Loading from './Loading'
import Toast from './Toast'
import { sessionState } from 'recoils/atoms'

const AdminLayoutInner = ({ route }) => {
  const auth = useRecoilValue(sessionState)

  if (!auth.token) history.push('/Login')

  return (
    <>
      <LeftSideBar>{renderRoutes(route.routes)}</LeftSideBar>
      <Loading />
      <Toast />
    </>
  )
}

const AdminLayout = ({ route }) => {
  return <AdminLayoutInner route={route}></AdminLayoutInner>
}

export default AdminLayout
