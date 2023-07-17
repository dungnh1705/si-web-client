import React, { Fragment, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { Button, List, ListItem, Menu } from '@material-ui/core'

export default function UserAction({ handleChangePassword, handleChangeStatus, handleChangeInfo }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickChangePassword = () => {
    handleClose()
    handleChangePassword()
  }

  const handleClickChangeStatus = () => {
    handleClose()
    handleChangeStatus()
  }

  const handleClickChangeInfo = () => {
    handleClose()
    handleChangeInfo()
  }

  return (
    <Fragment>
      <Button size="small" color="primary" onClick={handleOpen}>
        <FontAwesomeIcon icon={faEllipsisH} className="font-size-lg" />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        onClose={handleClose}>
        <div className="dropdown-menu-right dropdown-menu-lg overflow-hidden p-0">
          <List className="bg-transparent d-flex align-items-center flex-column pt-0">
            <ListItem key="action-edit-user" button onClick={handleClickChangeInfo}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-center">
                    <div className="d-flex align-items-center">Cập nhật thông tin</div>
                  </div>
                </div>
              </div>
            </ListItem>

            <ListItem key="action-change-password" button onClick={handleClickChangePassword}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-center">
                    <div className="d-flex align-items-center">Đổi mật khẩu</div>
                  </div>
                </div>
              </div>
            </ListItem>

            <ListItem key="action-update-status" button onClick={handleClickChangeStatus}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-center">
                    <div className="d-flex align-items-center">Thay đổi trạng thái</div>
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
