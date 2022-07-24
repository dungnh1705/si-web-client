import React from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Hidden, IconButton, AppBar, Box, Tooltip } from '@material-ui/core'
import projectLogo from 'assets/images/RynoInsurance.webp'

import { themeOptionsActions } from 'recoils/selectors'
import { themeOptionsState } from 'recoils/atoms'

import HeaderLogo from './HeaderLogo'
import HeaderSearch from './HeaderSearch'
import HeaderDots from './HeaderDots'
// import HeaderDrawer from '../../layout-components/HeaderDrawer';
import HeaderUserBox from './HeaderUserBox'
// import HeaderSearch from '../../layout-components/HeaderSearch';
import HeaderMenu from './HeaderMenu'

import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded'
import MenuRoundedIcon from '@material-ui/icons/MenuRounded'

const Header = ({ isCollapsedLayout = false }) => {
  const { headerShadow, headerFixed, sidebarToggleMobile, sidebarToggle } = useRecoilValue(themeOptionsState)
  const setThemeOptions = useSetRecoilState(themeOptionsActions)

  const toggleSidebar = () => {
    setThemeOptions({ name: 'sidebarToggle', value: !sidebarToggle })
  }

  const toggleSidebarMobile = () => {
    setThemeOptions({ name: 'sidebarToggleMobile', value: !sidebarToggleMobile })
  }

  return (
    <>
      <AppBar
        color="default"
        className={clsx('app-header', {
          'app-header-collapsed-sidebar': isCollapsedLayout
        })}
        position={headerFixed ? 'fixed' : 'absolute'}
        elevation={headerShadow ? 11 : 1}>
        {!sidebarToggle && <HeaderLogo />}
        <Box className="app-header-toolbar">
          <Hidden lgUp>
            <Box className="app-logo-wrapper" title="UnderwriteIt">
              <Link to="/" className="app-logo-link">
                <IconButton color="primary" size="medium" className="app-logo-btn">
                  <img className="app-logo-img" alt="UnderwriteIt" src={projectLogo} />
                </IconButton>
              </Link>
              <Hidden smDown>
                <Box className="app-logo-text">UnderwriteIt</Box>
              </Hidden>
            </Box>
          </Hidden>
          <Hidden mdDown>
            <Box className="d-flex align-items-center">
              {!isCollapsedLayout && (
                <Box
                  className={clsx('btn-toggle-collapse', {
                    'btn-toggle-collapse-closed': sidebarToggle
                  })}>
                  <Tooltip title="Toggle Sidebar" placement="right">
                    <IconButton color="inherit" onClick={toggleSidebar} size="medium" className="btn-inverse">
                      {sidebarToggle ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              <HeaderSearch />
              <HeaderMenu />
            </Box>
          </Hidden>
          <Box className="d-flex align-items-center">
            <HeaderDots />
            <HeaderUserBox />
            {/* 
           
            <HeaderDrawer /> */}
            <Box className="toggle-sidebar-btn-mobile">
              <Tooltip title="Toggle Sidebar" placement="right">
                <IconButton color="inherit" onClick={toggleSidebarMobile} size="medium">
                  {sidebarToggleMobile ? <MenuOpenRoundedIcon /> : <MenuRoundedIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </AppBar>
    </>
  )
}

export default Header
