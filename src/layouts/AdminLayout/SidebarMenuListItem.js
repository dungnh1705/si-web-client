import React, { useState, forwardRef } from 'react'
import { NavLink as RouterLink } from 'react-router-dom'
import clsx from 'clsx'

import { ListItem, Button, Collapse } from '@material-ui/core'

import ExpandLessIcon from '@material-ui/icons/ExpandLess'

const CustomRouterLink = forwardRef(function CustomLink(props, ref) {
  return (
    <div ref={ref} style={{ flexGrow: 1 }}>
      <RouterLink {...props} />
    </div>
  )
})

const SidebarMenuListItem = ({ title, href, depth, children, icon: Icon, className, open: openProp, label: Label, ...rest }) => {
  const [open, setOpen] = useState(openProp)

  const handleToggle = () => {
    setOpen(open => !open)
  }

  let paddingLeft = 14

  if (depth > 0) {
    paddingLeft = 32 + 20 * depth
  }

  const style = {
    paddingLeft
  }

  if (children) {
    return (
      <ListItem {...rest} className={clsx('app-sidebar-item', className)} disableGutters>
        <Button color="primary" className={clsx('app-sidebar-button', { active: open })} onClick={handleToggle} style={style}>
          {Icon && <Icon className="app-sidebar-icon" />}
          <span>{title}</span>
          {open ? <ExpandLessIcon className="sidebar-expand-icon" color="inherit" /> : <ExpandLessIcon className="sidebar-expand-icon sidebar-expand-icon-rotate" color="inherit" />}
        </Button>
        <Collapse in={open}>{children}</Collapse>
      </ListItem>
    )
  } else {
    return (
      <ListItem {...rest} className={clsx('app-sidebar-b', className)} disableGutters>
        <Button
          activeClassName="active-item"
          color="primary"
          disableRipple
          variant="text"
          className={clsx('app-sidebar-button', `depth-${depth}`)}
          component={CustomRouterLink}
          exact
          style={style}
          to={href}
          startIcon={Icon && <Icon />}>
          <span>{title}</span>
          {Label && (
            <span className="menu-item-label">
              <Label />
            </span>
          )}
        </Button>
      </ListItem>
    )
  }
}

SidebarMenuListItem.defaultProps = {
  depth: 0,
  open: false
}

export default SidebarMenuListItem
