import React, { Fragment } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
// import { Link } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Hidden, Drawer, IconButton, AppBar, Paper, Box, Button, Tooltip, Icon } from '@material-ui/core'

import SidebarHeader from './SidebarHeader'
import SidebarMenu from './SidebarMenu'

import navItems from 'config/navItems'

import { NavLink as RouterLink } from 'react-router-dom'

// import { Settings, CloudDrizzle, Search, Users, LifeBuoy, Coffee, Briefcase, Bell, File as FileIcon, Users as UsersIcon } from 'react-feather'
import { themeOptionsState } from 'recoils/atoms'
import { themeOptionsActions } from 'recoils/selectors'

import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined'
import PeopleOutlineOutlinedIcon from '@material-ui/icons/PeopleOutlineOutlined'
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined'

import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded'
import MenuRoundedIcon from '@material-ui/icons/MenuRounded'

const SidebarCollapsed = props => {
  const { setSidebarToggleMobile, sidebarToggleMobile, sidebarToggle } = useRecoilValue(themeOptionsState)
  const setThemeOptions = useSetRecoilState(themeOptionsActions)

  const closeDrawer = () => setSidebarToggleMobile(!sidebarToggleMobile)

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
        <Drawer anchor="left" open={sidebarToggleMobile} onClose={closeDrawer} variant="temporary" elevation={1} className="app-sidebar-wrapper-lg">
          <SidebarHeader />
          <PerfectScrollbar>{sidebarMenuContent}</PerfectScrollbar>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Paper elevation={1} square className="app-sidebar-collapsed-wrapper">
          <AppBar color="default" position="relative" elevation={1}>
            <div className="sidebar-collapsed-logo">
              <Box className="header-logo-wrapper" title="UnderwriteIt">
                <IconButton color="inherit" onClick={() => setThemeOptions({ name: 'sidebarToggle', value: false })} size="medium" className="btn-inverse">
                  {sidebarToggle ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
                </IconButton>
              </Box>
            </div>
          </AppBar>
          <div className="app-sidebar--content">
            <PerfectScrollbar>
              <ul className="sidebar-menu-collapsed">
                <li>
                  <Tooltip arrow placement="right" title="Quotes">
                    <Button className="app-sidebar-btn-wrapper" activeClassName="active" component={RouterLink} to="/Quotes">
                      <DescriptionOutlinedIcon className="app-sidebar-btn-icon" />
                    </Button>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip arrow placement="right" title="Users">
                    <Button className="app-sidebar-btn-wrapper" activeClassName="active" component={RouterLink} to="/Users">
                      <PeopleOutlineOutlinedIcon className="app-sidebar-btn-icon" />
                    </Button>
                  </Tooltip>
                </li>
                <li>
                  <Tooltip arrow placement="right" title="Reports">
                    <Button className="app-sidebar-btn-wrapper" activeClassName="active" component={RouterLink} to="/Reports">
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
