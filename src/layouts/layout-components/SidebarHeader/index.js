import React, { Fragment } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { IconButton, Box, Tooltip } from '@material-ui/core'

import projectLogo from 'assets/images/app-logo.png'

import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded'
import MenuRoundedIcon from '@material-ui/icons/MenuRounded'

import { themeOptionsActions } from 'recoils/selectors'
import { themeOptionsState } from 'recoils/atoms'

const SidebarHeader = props => {
  // const { sidebarToggleMobile, setSidebarToggleMobile, setSidebarToggle, sidebarToggle, sidebarHover } = useRecoilValue(themeOptionsState)
  const { sidebarToggleMobile, sidebarToggle, sidebarHover } = useRecoilValue(themeOptionsState)
  const setThemeOptions = useSetRecoilState(themeOptionsActions)

  const toggleSidebar = () => {
    setThemeOptions({ name: 'sidebarToggle', value: !sidebarToggle })
  }

  const toggleSidebarMobile = () => {
    setThemeOptions({ name: 'sidebarToggleMobile', value: !sidebarToggleMobile })
  }

  return (
    <Fragment>
      <div
        className={clsx('app-sidebar-header', {
          'app-sidebar-header-close': sidebarToggle && !sidebarHover
        })}>
        <Box className="header-logo-wrapper" title="Đoàn TNTT Thánh Phanxicô Xaviê Gx.Thạch Đà">
          <Link to="/Dashboard" className="header-logo-wrapper-link">
            <IconButton color="primary" size="medium" className="header-logo-wrapper-btn">
              <img className="app-sidebar-logo" alt="Đoàn TNTT Thánh Phanxicô Xaviê Gx.Thạch Đà" src={projectLogo} />
            </IconButton>
          </Link>
          <Box className="header-logo-text">TNTT Gx.Thạch Đà</Box>
        </Box>
        <Box
          className={clsx('app-sidebar-header-btn', {
            'app-sidebar-header-btn-close': sidebarToggle && !sidebarHover
          })}>
          <Tooltip title="Toggle Sidebar" placement="right">
            <IconButton color="inherit" onClick={toggleSidebar} size="medium">
              {sidebarToggle ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <Box className="app-sidebar-header-btn-mobile">
          <Tooltip title="Toggle Sidebar" placement="right">
            <IconButton color="inherit" onClick={toggleSidebarMobile} size="medium">
              {sidebarToggleMobile ? <MenuOpenRoundedIcon /> : <MenuRoundedIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </div>
    </Fragment>
  )
}

export default SidebarHeader
