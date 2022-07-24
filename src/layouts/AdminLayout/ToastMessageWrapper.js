import React from 'react'
import PropTypes from 'prop-types'
// import classNames from 'classnames'
// import CheckCircleIcon from '@material-ui/icons/CheckCircle'
// import ErrorIcon from '@material-ui/icons/Error'
// import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
// import SnackbarContent from '@material-ui/core/SnackbarContent'
// import WarningIcon from '@material-ui/icons/Warning'
import { makeStyles } from '@material-ui/styles'
import { Alert, AlertTitle } from '@material-ui/lab'

// const variantIcon = {
//   success: CheckCircleIcon,
//   warning: WarningIcon,
//   error: ErrorIcon,
//   info: InfoIcon
// }

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: '#43a047'
  },
  error: {
    backgroundColor: '#d32f2f'
  },
  info: {
    backgroundColor: '#2D323E'
  },
  warning: {
    backgroundColor: '#ffa000'
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: '1px'
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}))

const ToastMessageWrapper = props => {
  const classes = useStyles()
  const { className, message, onClose, variant, title, ...other } = props

  return (
    <Alert
      severity={variant}
      action={[
        <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={onClose} size="small">
          <CloseIcon className={classes.icon} size="small" />
        </IconButton>
      ]}
      {...other}>
      <AlertTitle>{title === '' ? `${variant.charAt(0).toUpperCase() + variant.slice(1)}!` : title}</AlertTitle>
      {message}
    </Alert>
  )
}

ToastMessageWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired
}

export default ToastMessageWrapper
