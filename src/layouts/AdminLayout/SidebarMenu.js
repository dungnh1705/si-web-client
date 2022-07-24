import React from 'react'
import { matchPath } from 'react-router-dom'
import { List, Typography } from '@material-ui/core'
import useRouter from 'utils/useRouter'
import SidebarMenuListItem from './SidebarMenuListItem'

const SidebarMenuList = ({ pages, ...rest }) => {
  return <List className="p-0">{pages.reduce((items, page) => reduceChildRoutes({ items, page, ...rest }), [])}</List>
}

const reduceChildRoutes = props => {
  const { router, items, page, depth } = props

  if (page.content) {
    const open = matchPath(router.location.pathname, {
      path: page.to,
      exact: false
    })

    items.push(
      <SidebarMenuListItem depth={depth} icon={page.icon} key={page.label} label={page.badge} open={Boolean(open)} title={page.label}>
        <div className="sidebar-menu-children py-2">
          <SidebarMenuList depth={depth + 1} pages={page.content} router={router} />
        </div>
      </SidebarMenuListItem>
    )
  } else {
    items.push(<SidebarMenuListItem depth={depth} href={page.to} icon={page.icon} key={page.label} label={page.badge} title={page.label} />)
  }

  return items
}

const SidebarMenu = ({ title, pages, className, component: Component, ...rest }) => {
  const router = useRouter()

  return (
    <Component {...rest} className={className}>
      {title && <Typography className="app-sidebar-heading">{title}</Typography>}
      <br />
      <SidebarMenuList depth={0} pages={pages} router={router} />
    </Component>
  )
}

SidebarMenu.defaultProps = {
  component: 'nav'
}

export default SidebarMenu
