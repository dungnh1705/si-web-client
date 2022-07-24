import typography from './typography'

/* eslint-disable import/no-unresolved, import/no-webpack-loader-syntax */
import vars from '!!sass-vars-to-js-loader!../assets/core/_variables-mui.scss'

const MuiTheme = {
  palette: {
    primary: {
      main: vars.primary
    },
    grey: {
      300: vars.inheritDefault1,
      A100: vars.inheritDefault2
    },
    secondary: {
      main: vars.secondary
    },
    error: {
      main: vars.red
    },
    success: {
      main: vars.green
    },
    warning: {
      main: vars.orange
    },
    helpers: {
      primary: vars.blue,
      main: 'rgba(25, 46, 91, .035)'
    },
    contrastThreshold: 3,
    tonalOffset: 0.1
  },
  shape: {
    borderRadius: '0.5rem'
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundColor: '#ffffff'
        }
      }
    },
    MuiButton: {
      // containedPrimary:
      // {
      //   backgroundColor: "#5384ff"
      // },
      // containedSecondary: {
      //   backgroundColor: "#ffffff"
      // },
      text: {
        paddingLeft: '14px',
        paddingRight: '14px'
      },
      containedSizeSmall: {
        paddingLeft: '14px',
        paddingRight: '14px'
      },
      root: {
        textTransform: 'none',
        fontWeight: 'normal'
      }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: vars.second,
        padding: '8px 16px',
        fontSize: '13px'
      },
      arrow: {
        color: vars.second
      }
    },
    MuiIcon: {
      root: {
        overflow: 'inherit'
      }
    }
  },
  typography
}

export default MuiTheme
