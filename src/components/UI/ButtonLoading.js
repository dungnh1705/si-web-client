import React, { Fragment } from 'react'
import { CircularProgress, Button } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  wrapper: {
    // margin: theme.spacing(1),
    position: 'relative'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}))

export default function ButtonLoading(props) {
  const classes = useStyles()

  const { btnText, loading, disabled, handleButtonClick, type } = props
  return (
    <Fragment>
      {/* <div className={classes.root}> */}
      <div className={classes.wrapper}>
        <Button type={type || 'button'} size="large" variant="contained" color="primary" disabled={loading || disabled} onClick={handleButtonClick} fullWidth>
          {btnText}
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
      {/* </div> */}
    </Fragment>
  )
}
