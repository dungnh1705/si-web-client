import React, { Suspense } from 'react'

import { renderRoutes } from 'react-router-config'
import { LeftSidebar } from 'layouts/layout-blueprints'
import { LinearProgress } from '@material-ui/core'

import Loading from 'layouts/AdminLayout/Loading'
import Toast from 'layouts/AdminLayout/Toast'

import { checkLoginToken } from 'utils/sessionHelper'

const CombinedLayout = props => {
  const { route } = props

  if (!checkLoginToken()) {
    window.location.href = '/Login'
  }

  return (
    <Suspense fallback={<LinearProgress />}>
      <LeftSidebar>{renderRoutes(route.routes)}</LeftSidebar>
      <Loading />
      <Toast />
    </Suspense>
  )
}

export default CombinedLayout
