import React from 'react'

import PerfectScrollbar from 'react-perfect-scrollbar'

import clsx from 'clsx'

import { useRecoilValue } from 'recoil'
import { themeOptionsState } from 'recoils/atoms'

import Header from './Header'
import Sidebar from './Sidebar'
import SidebarCollapsed from './SidebarCollapsed'

const LeftSideBar = ({ children }) => {
  const { contentBackground, sidebarToggle, sidebarFixed, footerFixed } = useRecoilValue(themeOptionsState)

  if (sidebarToggle)
    return (
      <>
        <div className={clsx('app-wrapper vh-100', contentBackground)}>
          <Header isCollapsedLayout={true} />
          <div className="app-main">
            <SidebarCollapsed />
            <div className={clsx('app-content')}>
              <div className="app-inner-content-layout--main">
                <div className="app-inner-content-layout app-inner-content-layout-fixed p-4">
                  {/* <div className={clsx('app-inner-content-layout--sidebar app-inner-content-layout--sidebar__lg bg-secondary border-right', { 'layout-sidebar-open': true })}> */}
                  {children}
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )

  return (
    <>
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
              <div className="app-content--inner__wrapper">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LeftSideBar
