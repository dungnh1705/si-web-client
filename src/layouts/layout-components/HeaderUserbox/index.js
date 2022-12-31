import React, { Fragment, useState } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { Avatar, Box, Menu, Button, List, ListItem, Divider } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

import { history } from 'App'
import Badge from 'components/UI/Badge'
import sessionHelper, { deleteLoginData, getMaxRole } from 'utils/sessionHelper'
import { HolyNameQuery, UserAvatarQuery } from 'recoils/selectors'
import { ShowChangePassword } from 'recoils/atoms'

const HeaderUserBox = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const session = sessionHelper()

  const lstHolyName = useRecoilValue(HolyNameQuery)
  const userAvatar = useRecoilValue(UserAvatarQuery)
  const [openChangePass, setOpenChangePass] = useRecoilState(ShowChangePassword)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const logout = () => {
    setAnchorEl(null)
    deleteLoginData()

    history.push('/Login')
  }

  const onToggle = () => {
    setOpenChangePass(!openChangePass)
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <Button size="medium" color="inherit" onClick={handleClick} className="text-capitalize px-3 text-left btn-inverse d-flex align-items-center">
        <Box>
          <Badge
            isActive={true}
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            variant="dot"
            className="p-0 m-0"
            child={
              <Avatar className="p-0 m-0" sizes="44" alt={`${session?.firstName} ${session?.lastName}`} src={userAvatar.avatarUrl}>
                {`${session?.firstName?.substring(0, 1)}${session?.lastName?.substring(0, 1)}`}
              </Avatar>
            }
          />
        </Box>
        <div className="d-none d-xl-block pl-3">
          <div className="font-weight-bold pt-2 line-height-1">
            {lstHolyName.find(i => i.id === Number(session.holyNameId))?.name} {session?.firstName} {session?.lastName}
          </div>
          <span className="text-white-50">{getMaxRole()}</span>
        </div>
        <span className="pl-1 pl-xl-3">
          <FontAwesomeIcon icon={faAngleDown} className="opacity-5" />
        </span>
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
              <Avatar src={userAvatar.avatarUrl}>{`${session?.firstName?.substring(0, 1)}${session?.lastName?.substring(0, 1)}`}</Avatar>
            </Box>
            <div>
              <div className="font-weight-bold text-center pt-2 line-height-1">
                {lstHolyName.find(i => i.id === Number(session.holyNameId))?.name} {session?.firstName} {session?.lastName}
              </div>
              <div className="text-black-50 text-center"># {getMaxRole()}</div>
              <div className="text-black-50 text-center">{session?.classInfo}</div>
            </div>
            <Divider className="w-100 mt-2" />
            <ListItem button>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-center" onClick={onToggle}>
                    <div className="d-flex align-items-center">Đổi mật khẩu</div>
                  </div>
                </div>
              </div>
            </ListItem>
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

export default HeaderUserBox
