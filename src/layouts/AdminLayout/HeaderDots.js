import React from 'react'

import { IconButton, Hidden, Box } from '@material-ui/core'
import NotificationsActiveTwoToneIcon from '@material-ui/icons/NotificationsActiveTwoTone'

const HeaderUserBox = () => {
  return (
    <div className="d-flex align-items-center popover-header-wrapper">
      <Hidden smDown>
        <Box component="span" pr="2">
          <IconButton size='medium' color="inherit" className="btn-inverse mx-1 d-50">
            <div className="badge badge-pill badge-warning badge-header">3</div>
            <NotificationsActiveTwoToneIcon />
          </IconButton>
        </Box>
      </Hidden>
    </div>
  )
}

export default HeaderUserBox
