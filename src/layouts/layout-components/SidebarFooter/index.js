import React, { Fragment } from 'react'
import { IconButton, Box, Tooltip } from '@material-ui/core'

import { Bell, Activity, Briefcase, Calendar } from 'react-feather'

export default function SidebarFooter() {
  return (
    <Fragment>
      <Box className="app-sidebar-footer-wrapper">
        <ul className="app-sidebar-footer">
          <li>
            <Tooltip arrow title="Projects Application">
              <IconButton size='medium' href="/ApplicationsProjects">
                <Activity />
              </IconButton>
            </Tooltip>
          </li>
          <li>
            <Tooltip arrow title="Helpdesk Dashboard">
              <IconButton size='medium' href="/DashboardHelpdesk" className="mx-1">
                <Bell />
              </IconButton>
            </Tooltip>
          </li>
          <li>
            <Tooltip arrow title="Calendar Application">
              <IconButton size='medium' href="/ApplicationsCalendar" className="mx-1">
                <Calendar />
              </IconButton>
            </Tooltip>
          </li>
          <li>
            <Tooltip arrow title="Buttons">
              <IconButton size='medium' href="/Buttons">
                <Briefcase />
              </IconButton>
            </Tooltip>
          </li>
        </ul>
      </Box>
    </Fragment>
  )
}
