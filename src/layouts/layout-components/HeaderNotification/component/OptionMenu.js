import React, { useState } from 'react'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import { MoreHoriz } from '@material-ui/icons'

export default function OptionMenu({ options, onClose = null }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}>
        <MoreHoriz />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button'
        }}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={open}
        onClose={() => {
          setAnchorEl(null)
          onClose && onClose()
        }}>
        {options.map((option, index) => (
          <MenuItem key={index} onClick={option.action}>
            {option.icon}
            &nbsp;
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
