import React, { Fragment } from 'react'
import { useRecoilValue } from 'recoil'

import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { Paper, List, ListItem, ListItemText } from '@material-ui/core'

import { themeOptionsState } from 'recoils/atoms'

const Footer = props => {
  const { footerShadow, sidebarToggle, footerFixed } = useRecoilValue(themeOptionsState)

  return (
    <Fragment>
      <Paper
        square
        elevation={footerShadow ? 11 : 2}
        className={clsx('app-footer text-black-50', {
          'app-footer--fixed': footerFixed,
          'app-footer--fixed__collapsed': sidebarToggle
        })}>
        <div className="app-footer--inner">
          <div className="app-footer--first">
            <List dense className="d-flex align-items-center">
              <ListItem className="rounded-sm text-nowrap" button component={Link} to="/DashboardAnalytics">
                <ListItemText primary="Analytics" />
              </ListItem>
              <ListItem className="rounded-sm text-nowrap" button component={Link} to="/FormsWizard">
                <ListItemText primary="Wizards" />
              </ListItem>
              <ListItem className="rounded-sm text-nowrap" button component={Link} to="/DashboardCrmManager">
                <ListItemText primary="CRM Manager" />
              </ListItem>
            </List>
          </div>
          <div className="app-footer--second">
            <span>Carolina React Admin Dashboard with Material-UI PRO</span> © 2020 - crafted with <span className="text-danger px-1">❤</span> by{' '}
            <a href="https://uifort.com" title="UiFort.com">
              UiFort.com
            </a>
          </div>
        </div>
      </Paper>
    </Fragment>
  )
}

export default Footer
