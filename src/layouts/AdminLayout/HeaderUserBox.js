import React, { Fragment, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Avatar, Box, Badge, Menu, Button, List, ListItem, Divider } from '@material-ui/core'
import { history } from 'App'
import { sessionState } from 'recoils/atoms'

import { deleteLoginData } from 'utils/sessionHelper'

// const StyledBadge = withStyles({
//   badge: {
//     backgroundColor: 'var(--success)',
//     color: 'var(--success)',
//     boxShadow: '0 0 0 2px #fff',
//     '&::after': {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//       borderRadius: '50%',
//       animation: '$ripple 1.2s infinite ease-in-out',
//       border: '1px solid currentColor',
//       content: '""'
//     }
//   },
//   '@keyframes ripple': {
//     '0%': {
//       transform: 'scale(.8)',
//       opacity: 1
//     },
//     '100%': {
//       transform: 'scale(2.4)',
//       opacity: 0
//     }
//   }
// })(Badge)

export default function HeaderUserBox() {
  const [session, setSession] = useRecoilState(sessionState)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const logout = () => {
    setAnchorEl(null)

    deleteLoginData()
    setSession({})

    window.location.reload()
  }

  return (
    <Fragment>
      <Button size='large' color="inherit" onClick={handleClick} className="text-capitalize px-3 text-left btn-inverse d-flex align-items-center">
        <Box>
          <Avatar alt={`${session?.firstName} ${session?.lastName}`} src={session?.croppedAvatarId ? `img/avatar/${session.croppedAvatarId}.png` : ''} className="mr-2">
            {`${session?.firstName?.substring(0, 1)}${session?.lastName?.substring(0, 1)}`}
          </Avatar>
        </Box>
        <span className="font-weight-bold">{session?.lastName}</span>
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        onClose={handleClose}
        className="ml-2">
        <div className="dropdown-menu-right dropdown-menu-lg overflow-hidden p-0">
          <List className="text-left bg-transparent d-flex align-items-center flex-column pt-0">
            <Box>
              <Avatar src={session?.croppedAvatarId ? `img/avatar/${session.croppedAvatarId}.png` : ''}>{`${session?.firstName?.substring(0, 1)}${session?.lastName?.substring(0, 1)}`}</Avatar>
            </Box>
            <div>
              <div className="font-weight-bold text-center pt-2 line-height-1">{`${session?.firstName} ${session?.lastName}`}</div>
              {/* <div className="text-black-50 text-center">#{auth?.Data?.Role.Name}</div> */}
            </div>
            <Divider className="w-100 mt-2" />
            <ListItem
              button
              onClick={() => {
                handleClose()
                history.push('/MyProfile')
              }}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-center">
                    <div className="d-flex align-items-center">Thông tin cá nhân</div>
                  </div>
                </div>
              </div>
            </ListItem>
            <ListItem button onClick={logout}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-center">
                    <div className="d-flex align-items-center">Đăng xuất</div>
                  </div>
                </div>
              </div>
            </ListItem>
          </List>
        </div>
      </Menu>
    </Fragment>
  )
}
