import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Avatar, IconButton, Box, Typography, Menu, Button, List, ListItem } from '@material-ui/core'

import avatar2 from 'assets/images/avatars/avatar2.jpg'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import { themeOptionsState } from 'recoils/atoms'

const SidebarUserbox = () => {
  const { sidebarToggle, sidebarHover } = useRecoilValue(themeOptionsState)
  const [anchorEl, setAnchorEl] = useState(null)

  function openUserMenu(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <>
      <Box
        className={clsx('app-sidebar-userbox', {
          'app-sidebar-userbox--collapsed': sidebarToggle && !sidebarHover
        })}>
        <IconButton aria-controls="userMenu" onClick={openUserMenu} className="app-sidebar-userbox-btn" size="medium">
          <MoreVertIcon fontSize="inherit" />
        </IconButton>
        <Menu
          id="userMenu"
          anchorEl={anchorEl}
          keepMounted
          getContentAnchorEl={null}
          classes={{ list: 'p-0' }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}>
          <div className="dropdown-menu-right dropdown-menu-xl p-0">
            <div className="bg-composed-wrapper bg-vicious-stance mt-0">
              <div className="bg-composed-wrapper--image bg-composed-img-5" />
              <div className="bg-composed-wrapper--content text-light text-center p-4">
                <h5 className="mb-1">Scrollable</h5>
                <p className="mb-0 opacity-7">This menu box is scrollable (sm)</p>
              </div>
            </div>
            <div className="scroll-area-sm shadow-overflow">
              <PerfectScrollbar>
                <List className="flex-column">
                  <ListItem button>
                    <div className="nav-link-icon opacity-6">{/* <FontAwesomeIcon icon={['far', 'chart-bar']} /> */}</div>
                    <span>Services</span>
                  </ListItem>
                  <ListItem button>
                    <div className="nav-link-icon opacity-6">{/* <FontAwesomeIcon icon={['far', 'question-circle']} /> */}</div>
                    <span>Layouts</span>
                    <span className="ml-auto badge badge-warning">512</span>
                  </ListItem>
                  <ListItem button>
                    <div className="nav-link-icon opacity-6">{/* <FontAwesomeIcon icon={['far', 'user-circle']} /> */}</div>
                    <span>Reports</span>
                  </ListItem>
                  <Typography className="text-black py-2 px-3" component="div">
                    Others
                  </Typography>
                  <ListItem button>
                    <div className="nav-link-icon opacity-6">{/* <FontAwesomeIcon icon={['far', 'object-group']} /> */}</div>
                    <span>Components</span>
                  </ListItem>
                  <ListItem button>
                    <div className="nav-link-icon opacity-6">{/* <FontAwesomeIcon icon={['far', 'chart-bar']} /> */}</div>
                    <span>Services</span>
                  </ListItem>
                </List>
              </PerfectScrollbar>
            </div>
            <div className="card-footer d-flex justify-content-between">
              <Button size="large" variant="outlined" color="secondary">
                Action
              </Button>
              <Button color="primary" variant="contained" size="large">
                <span>View details</span>
              </Button>
            </div>
          </div>
        </Menu>
        <Avatar alt="Remy Sharp" src={avatar2} className="app-sidebar-userbox-avatar" />
        <Box className="app-sidebar-userbox-name">
          <Box>
            <b>Emma Taylor</b>
          </Box>
          <Box className="app-sidebar-userbox-description">Senior Web Developer</Box>
          <Box className="app-sidebar-userbox-btn-profile">
            <Button size="small" color="secondary" variant="contained" className="text-white" href="/PagesProfile">
              View profile
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default SidebarUserbox
