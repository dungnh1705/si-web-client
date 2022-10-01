import React, { Fragment } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { Hidden, IconButton, AppBar, Box, Tooltip } from '@material-ui/core'

import projectLogo from 'assets/images/app-logo.png'

import HeaderLogo from '../../layout-components/HeaderLogo'
// import HeaderDots from '../../layout-components/HeaderDots'
// import HeaderDrawer from '../../layout-components/HeaderDrawer'
import HeaderUserBox from '../HeaderUserbox'
import HeaderSearch from '../../layout-components/HeaderSearch'
// import HeaderMenu from '../../layout-components/HeaderMenu'

import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded'
import MenuRoundedIcon from '@material-ui/icons/MenuRounded'

import { themeOptionsState } from 'recoils/atoms'
import { themeOptionsActions } from 'recoils/selectors'
import { ChangePasswordDialog } from 'components/Dialog'

const Header = props => {
  const setThemeOptions = useSetRecoilState(themeOptionsActions)
  const { headerShadow, headerFixed, sidebarToggleMobile, sidebarToggleheaderShadow, sidebarToggle, layoutStyle, headerColor } = useRecoilValue(themeOptionsState)

  const toggleSidebar = () => {
    setThemeOptions({ name: 'sidebarToggle', value: !sidebarToggle })
  }

  const toggleSidebarMobile = () => {
    setThemeOptions({ name: 'sidebarToggleMobile', value: !sidebarToggleMobile })
  }

  // const setLayoutStyle = () => {
  //   setThemeOptions({ name: 'layoutStyle', value: layoutStyle === 1 ? 2 : 1 })
  // }

  return (
    <Fragment>
      <AppBar
        color="primary"
        className={clsx('app-header', {
          'app-header-collapsed-sidebar': props.isCollapsedLayout
        })}
        position={headerFixed ? 'fixed' : 'absolute'}
        elevation={headerShadow ? 11 : 3}>
        {!props.isCollapsedLayout && <HeaderLogo />}
        <Box className="app-header-toolbar">
          <Hidden lgUp>
            <Box className="app-logo-wrapper" title="TNTT Gx.Thạch Đà">
              <Link to="/Dashboard" className="app-logo-link">
                <IconButton color="primary" size="medium" className="app-logo-btn">
                  <img className="app-logo-img" alt="Carolina React Admin Dashboard with Material-UI PRO" src={projectLogo} />
                </IconButton>
              </Link>
              <Hidden smDown>
                <Box className="app-logo-text">TNTT Gx.Thạch Đà</Box>
              </Hidden>
            </Box>
          </Hidden>
          <Hidden mdDown>
            <Box className="d-flex align-items-center">
              {!props.isCollapsedLayout && (
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
              {/* <HeaderMenu /> */}
            </Box>
          </Hidden>
          <Box className="d-flex align-items-center">
            {/* <HeaderDots /> */}
            <HeaderSearch />
            <HeaderUserBox />
            {/* <HeaderDrawer /> */}
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

      <ChangePasswordDialog />
    </Fragment>
  )
}

export default Header
