import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { Router } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { createBrowserHistory } from 'history'
import { ThemeProvider } from '@material-ui/styles'
import './assets/base.scss'
import MuiTheme from './theme'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createTheme, Fab } from '@material-ui/core'
import routes from './routes'
import { themeColor } from 'recoils/atoms'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import ScrollToTop from './components/ScrollToTop'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { NotificationPermissionSelector } from './recoils/selectors'

export const history = createBrowserHistory()

const App = () => {
  const _themeColor = useRecoilValue(themeColor)
  const _notificationPermission = useRecoilValue(NotificationPermissionSelector)

  useEffect(() => {
    localStorage.setItem('si_primaryColor', _themeColor.primary)
    localStorage.setItem('si_secondaryColor', _themeColor.secondary)
  }, [_themeColor])

  useEffect(() => {
    localStorage.setItem('notification', _notificationPermission)
  }, [_notificationPermission])

  const overrideColor = {
    primary: {
      main: _themeColor.primary
    },
    secondary: {
      main: _themeColor.secondary
    }
  }

  const theme = {
    ...MuiTheme,
    palette: { ...MuiTheme.palette, ...overrideColor },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536
      }
    }
  }

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <CssBaseline />
        <Router history={history}>{renderRoutes(routes)}</Router>

        <ScrollToTop>
          <Fab color="primary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollToTop>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  )
}

export default App
