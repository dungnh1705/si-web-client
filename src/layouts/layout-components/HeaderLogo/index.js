import React, { Fragment } from 'react'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { IconButton, Box } from '@material-ui/core'

import projectLogo from 'assets/images/app-logo.png'

import { themeOptionsState } from 'recoils/atoms'

const HeaderLogo = props => {
  const { sidebarToggle, sidebarHover } = useRecoilValue(themeOptionsState)

  return (
    <Fragment>
      <div
        className={clsx('app-header-logo', {
          'app-header-logo-close': sidebarToggle,
          'app-header-logo-open': sidebarHover
        })}>
        <Box className="header-logo-wrapper" title="TNTT Gx.Thạch Đà">
          <Link to="/Dashboard" className="header-logo-wrapper-link">
            <IconButton color="primary" size="medium" className="header-logo-wrapper-btn">
              <img className="app-header-logo-img" alt="Carolina React Admin Dashboard with Material-UI PRO" src={projectLogo} />
            </IconButton>
          </Link>
          <Box className="header-logo-text">TNTT Gx.Thạch Đà</Box>
        </Box>
      </div>
    </Fragment>
  )
}

export default HeaderLogo
