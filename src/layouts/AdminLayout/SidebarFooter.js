import React from 'react'
import { IconButton, Box, Tooltip } from '@material-ui/core'
import { Bell, Activity } from 'react-feather'

export default function SidebarFooter() {
  return (
    <>
      <Box className="app-sidebar-footer-wrapper">
        <ul className="app-sidebar-footer">
          <li>
            <Tooltip arrow title="RQT">
              <IconButton size='medium' href="/ApplicationsProjects">
                <Activity />
              </IconButton>
            </Tooltip>
          </li>
          <li>
            <Tooltip arrow title="Zoho">
              <IconButton size='medium' href="/DashboardHelpdesk" className="mx-1">
                <Bell />
              </IconButton>
            </Tooltip>
          </li>
        </ul>
      </Box>
    </>
  )
}
