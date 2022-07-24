import React from 'react'
import clsx from 'clsx'
// import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Modal, Card, CardContent, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 360,
    maxWidth: '100%'
  }
}))

const UserDetails = ({ open, onClose, user, className, ...rest }) => {
  const classes = useStyles()

  if (!open) {
    return null
  }

  return (
    <Modal onClose={onClose} open={open}>
      <Card {...rest} className={clsx(classes.root, className)}>
        <CardContent>
          <Typography variant="h6">{user.firstName}</Typography>
          <Typography variant="body1">{user.lastName}</Typography>
        </CardContent>
      </Card>
    </Modal>
  )
}

// UserDetails.displayName = 'UserDetails'

// UserDetails.propTypes = {
//   className: PropTypes.string,
//   onClose: PropTypes.func,
//   open: PropTypes.bool,
//   user: PropTypes.any
// }

// UserDetails.defaultProps = {
//   open: false,
//   onClose: () => {}
// }

export default UserDetails
