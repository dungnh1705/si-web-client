import React from 'react'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { IconButton, Box } from '@material-ui/core'
import projectLogo from 'assets/images/ryno-logo.png'

import { themeOptionsState } from 'recoils/atoms'

const HeaderLogo = () => {
  const { sidebarToggle, sidebarHover } = useRecoilValue(themeOptionsState)

  return (
    <>
      <div
        className={clsx('app-header-logo', {
          'app-header-logo-close': sidebarToggle,
          'app-header-logo-open': sidebarHover
        })}>
        <Box className="header-logo-wrapper" title="UnderwriteIt">
          <Link to="/Users" className="header-logo-wrapper-link">
            <IconButton color="primary" size="medium" className="header-logo-wrapper-btn">
              <img className="app-header-logo-img" alt="UnderwriteIt" src={projectLogo} />
            </IconButton>
          </Link>
          <Box className="header-logo-text">UnderwriteIt</Box>
        </Box>
      </div>
    </>
  )
}

export default HeaderLogo
