import React, { useRef, useState, memo } from 'react'
import PropTypes from 'prop-types'
import { ListItemIcon, ListItemText, Tooltip, IconButton, Menu, MenuItem } from '@material-ui/core'
import MoreIcon from '@material-ui/icons/MoreVert'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import CancelIcon from '@material-ui/icons/Cancel'

function GenericMoreButton({ assginLeadOfGroup, removeOnClass, ...props }) {
  const moreRef = useRef(null)
  const [openMenu, setOpenMenu] = useState(false)

  const handleMenuOpen = () => {
    setOpenMenu(true)
  }

  const handleMenuClose = () => {
    setOpenMenu(false)
  }

  const handleAssignLeadOfGroup = () => {
    assginLeadOfGroup()
    handleMenuClose()
  }

  const handleRemoveOnClass = () => {
    removeOnClass()
    handleMenuClose()
  }

  return (
    <>
      <Tooltip title="More options">
        <IconButton {...props} onClick={handleMenuOpen} ref={moreRef} size="small" style={{ paddingTop: '4px', paddingRight: '1px' }}>
          <MoreIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={moreRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        elevation={1}
        onClose={handleMenuClose}
        open={openMenu}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}>
        <MenuItem onClick={handleAssignLeadOfGroup}>
          <ListItemIcon>
            <ArrowUpwardIcon />
          </ListItemIcon>
          <ListItemText primary="Phân Đoàn trưởng" />
        </MenuItem>
        <MenuItem onClick={handleRemoveOnClass}>
          <ListItemIcon>
            <CancelIcon />
          </ListItemIcon>
          <ListItemText primary="Xóa khỏi phân đoàn" />
        </MenuItem>
      </Menu>
    </>
  )
}

GenericMoreButton.propTypes = {
  className: PropTypes.string,
  assginLeadOfGroup: PropTypes.func,
  removeOnClass: PropTypes.func
}

export default memo(GenericMoreButton)
