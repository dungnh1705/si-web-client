import React, { Fragment } from 'react'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'

import { themeOptionsState } from 'recoils/atoms'

import { Sidebar, Header, Footer, ThemeConfigurator } from '../../layout-components'

const LeftSidebar = props => {
  const { children, contentBackground } = props
  const { sidebarToggle, sidebarFixed, footerFixed } = useRecoilValue(themeOptionsState)

  return (
    <Fragment>
      <div className={clsx('app-wrapper', contentBackground)}>
        <Header />
        <div
          className={clsx('app-main', {
            'app-main-sidebar-static': !sidebarFixed
          })}>
          <Sidebar />
          <div
            className={clsx('app-content', {
              'app-content-sidebar-collapsed': sidebarToggle,
              'app-content-sidebar-fixed': sidebarFixed,
              'app-content-footer-fixed': footerFixed
            })}>
            <div className="app-content--inner">
              <div className="app-content--inner__wrapper" style={{ marginTop: '-20px' }}>
                {children}
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        </div>
      </div>
      <ThemeConfigurator />
    </Fragment>
  )
}

export default LeftSidebar
