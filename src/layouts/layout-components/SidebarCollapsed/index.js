import React, { Fragment } from 'react'
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil'
// import MenuRoundedIcon from '@material-ui/icons/MenuRounded'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Hidden, Drawer, IconButton, AppBar, Paper, Box, Button, Tooltip, Link } from '@material-ui/core'

import { themeOptionsActions, authState } from 'recoils/selectors'
import { themeOptionsState, forceCheckingAuth } from 'recoils/atoms'
// import { ReloadQuoteListState } from 'pages/Admin/Quotes/recoil'

import SidebarHeader from '../SidebarHeader'
import SidebarMenu from '../SidebarMenu'

import navItems from 'config/navItems'

import { NavLink as RouterLink } from 'react-router-dom'
import projectLogo from 'assets/images/app-logo.png'

import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined'
import PeopleOutlineOutlinedIcon from '@material-ui/icons/PeopleOutlineOutlined'
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined'

const SidebarCollapsed = props => {
  const { sidebarToggleMobile, sidebarToggle, layoutStyle } = useRecoilValue(themeOptionsState)
  const setThemeOptions = useSetRecoilState(themeOptionsActions)
  const [forceChecking, setForChecking] = useRecoilState(forceCheckingAuth)
  // let auth = useRecoilValue(authState)
  // let setReloadQuotes = useSetRecoilState(ReloadQuoteListState)

  const setLayoutStyle = () => {
    setThemeOptions({ name: 'layoutStyle', value: layoutStyle === 1 ? 2 : 1 })
  }

  const setForceChecking = () => {
    setForChecking(forceChecking + 1)
  }
  const closeDrawer = () => setThemeOptions({ name: 'sidebarToggleMobile', value: !sidebarToggleMobile })

  const sidebarMenuContent = (
    <div>
      {navItems.map(list => (
        <SidebarMenu component="div" key={list.label} pages={list.content} title={list.label} />
      ))}
    </div>
  )

  return (
    <Fragment>
      <Hidden lgUp>
        <Drawer anchor="left" open={sidebarToggleMobile} onClose={closeDrawer} variant="temporary" elevation={4} className="app-sidebar-wrapper-lg">
          <SidebarHeader />
          <PerfectScrollbar>
            {/* <SidebarUserbox /> */}
            {sidebarMenuContent}
          </PerfectScrollbar>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Paper elevation={7} square className="app-sidebar-collapsed-wrapper">
          <AppBar color="primary" position="relative" elevation={0}>
            <div className="sidebar-collapsed-logo">
              <Box className="header-logo-wrapper" title="Xứ Đoàn TNTT Thánh Phanxicô Xaviê Gx.Thạch Đà">
                <Link to="/Dashboard" className="header-logo-wrapper-link">
                  <IconButton color="primary" size="medium" className="header-logo-wrapper-btn">
                    <img className="app-sidebar-logo" alt="Xứ Đoàn TNTT Thánh Phanxicô Xaviê Gx.Thạch Đà" src={projectLogo} />
                  </IconButton>
                </Link>
              </Box>
            </div>
          </AppBar>
          <div className="app-sidebar--content">
            <PerfectScrollbar>
              <ul className="sidebar-menu-collapsed">
                <li>
                  <Tooltip arrow placement="right" title="Dashboard">
                    <Button
                      size="large"
                      className="app-sidebar-btn-wrapper"
                      activeClassName="active"
                      component={RouterLink}
                      to="/Dashboard"
                      onClick={() => {
                        setForceChecking()
                      }}>
                      <DescriptionOutlinedIcon className="app-sidebar-btn-icon" />
                    </Button>
                  </Tooltip>
                </li>

                <li>
                  <Tooltip arrow placement="right" title="Users">
                    <Button size="large" className="app-sidebar-btn-wrapper" activeClassName="active" component={RouterLink} to="/Users" onClick={setForceChecking}>
                      <PeopleOutlineOutlinedIcon className="app-sidebar-btn-icon" />
                    </Button>
                  </Tooltip>
                </li>

                <li>
                  <Tooltip arrow placement="right" title="Reports">
                    <Button size="large" className="app-sidebar-btn-wrapper" activeClassName="active" component={RouterLink} to="/Reports" onClick={setForceChecking}>
                      <BarChartOutlinedIcon className="app-sidebar-btn-icon" />
                    </Button>
                  </Tooltip>
                </li>
              </ul>
            </PerfectScrollbar>
          </div>
        </Paper>
      </Hidden>
    </Fragment>
  )
}

export default SidebarCollapsed
