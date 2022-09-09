import React, { Fragment, Suspense } from 'react'
// import { useRecoilState, useRecoilValue } from 'recoil'
// import { sessionState, themeOptionsState } from 'recoils/atoms'
import { renderRoutes } from 'react-router-config'
import { LeftSidebar, CollapsedSidebar, MinimalLayout, PresentationLayout } from 'layouts/layout-blueprints'
import { LinearProgress } from '@material-ui/core'

// import { authState } from 'recoils/selectors'
import { history } from 'App'

import Loading from 'layouts/AdminLayout/Loading'
import Toast from 'layouts/AdminLayout/Toast'

import { checkLoginToken } from 'utils/sessionHelper'

const CombinedLayout = props => {
  if (!checkLoginToken()) history.push('/Login')

  const { children, route } = props

  // const { layoutStyle } = useRecoilValue(themeOptionsState)

  // if (layoutStyle === 1)
  return (
    <Suspense fallback={<LinearProgress />}>
      <LeftSidebar>{renderRoutes(route.routes)}</LeftSidebar>
      <Loading />
      <Toast />
    </Suspense>
  )

  // return (
  //   <>
  //     <CollapsedSidebar>{renderRoutes(route.routes)}</CollapsedSidebar>
  //     <Loading />
  //     <Toast />
  //   </>
  // )
}

export default CombinedLayout
