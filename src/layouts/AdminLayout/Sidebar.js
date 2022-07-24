import React, { Fragment } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import clsx from 'clsx'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Hidden, Drawer, Paper } from '@material-ui/core'

import SidebarHeader from './SidebarHeader'
// import SidebarUserbox from './SidebarUserbox'
import SidebarMenu from './SidebarMenu'
import SidebarFooter from './SidebarFooter'

import { themeOptionsActions } from 'recoils/selectors'
import { themeOptionsState } from 'recoils/atoms'

import navItems from 'config/navItems'

const Sidebar = () => {
  const { sidebarToggleMobile, sidebarFixed, sidebarHover, sidebarToggle, sidebarShadow, sidebarFooter } = useRecoilValue(themeOptionsState)
  const setThemeOptions = useSetRecoilState(themeOptionsActions)

  const toggleHoverOn = () => setThemeOptions({ name: 'sidebarHover', value: true })
  const toggleHoverOff = () => setThemeOptions({ name: 'sidebarHover', value: false })

  const closeDrawer = () => setThemeOptions({ name: 'sidebarToggleMobile', value: !sidebarToggleMobile })

  const sidebarMenuContent = (
    <div
      className={clsx({
        'app-sidebar-nav-close': sidebarToggle && !sidebarHover
      })}>
      {navItems.map(list => (
        <SidebarMenu component="div" key={list.label} pages={list.content} title={list.label} />
      ))}
    </div>
  )

  return (
    <Fragment>
      <Hidden lgUp>
        <Drawer anchor="left" open={sidebarToggleMobile} onClose={closeDrawer} variant="temporary" elevation={1} className="app-sidebar-wrapper-lg">
          <SidebarHeader />
          <PerfectScrollbar>
            {sidebarMenuContent}
            {sidebarFooter && <SidebarFooter />}
          </PerfectScrollbar>
        </Drawer>
      </Hidden>

      <Hidden mdDown>
        <Paper
          // onMouseEnter={toggleHoverOn}
          // onMouseLeave={toggleHoverOff}
          className={clsx('app-sidebar-wrapper', {
            'app-sidebar-wrapper-close': sidebarToggle,
            'app-sidebar-wrapper-open': sidebarHover,
            'app-sidebar-wrapper-fixed': sidebarFixed
          })}
          square
          open={sidebarToggle}
          elevation={sidebarShadow ? 11 : 1}>
          <SidebarHeader />
          <div
            className={clsx({
              'app-sidebar-menu': sidebarFixed,
              'app-sidebar-collapsed': sidebarToggle && !sidebarHover
            })}>
            <PerfectScrollbar options={{ wheelPropagation: false }}>
              {/* {sidebarUserbox && <SidebarUserbox />} */}
              {sidebarMenuContent}
              {sidebarFooter && <SidebarFooter />}
            </PerfectScrollbar>
          </div>
        </Paper>
      </Hidden>
    </Fragment>
  )
}

export default Sidebar
