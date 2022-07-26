import React from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { IconButton, Box, Tooltip } from '@material-ui/core'
import projectLogo from '../../assets/images/react.svg'
import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded'
import MenuRoundedIcon from '@material-ui/icons/MenuRounded'

import { themeOptionsActions } from 'recoils/selectors'
import { themeOptionsState } from 'recoils/atoms'

const SidebarHeader = () => {
  const { sidebarToggleMobile, sidebarToggle, sidebarHover } = useRecoilValue(themeOptionsState)
  const setThemeOptions = useSetRecoilState(themeOptionsActions)

  const toggleSidebar = () => {
    setThemeOptions({ name: 'sidebarToggle', value: !sidebarToggle })
  }

  const toggleSidebarMobile = () => {
    setThemeOptions({ name: 'sidebarToggleMobile', value: !sidebarToggleMobile })
  }

  return (
    <>
      <div
        className={clsx('app-sidebar-header', {
          'app-sidebar-header-close': sidebarToggle && !sidebarHover
        })}>
        <Box className="header-logo-wrapper" title="UnderwriteIt">
          <Link to="/Users" className="header-logo-wrapper-link">
            <IconButton color="primary" size="medium" className="header-logo-wrapper-btn">
              <img className="app-sidebar-logo" alt="UnderwriteIt" src={projectLogo} />
            </IconButton>
          </Link>
          <Box className="header-logo-text">UnderwriteIt</Box>
        </Box>
        <Box
          className={clsx('app-sidebar-header-btn', {
            'app-sidebar-header-btn-close': sidebarToggle && !sidebarHover
          })}>
          <Tooltip title="Toggle Sidebar" placement="right">
            <IconButton size='medium' color="inherit" onClick={toggleSidebar}>
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
    </>
  )
}

export default SidebarHeader
