import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Typography, Tooltip, IconButton, Card } from '@material-ui/core'
import PropTypes from 'prop-types'
// import AddIcon from '@material-ui/icons/Add'
import clsx from 'clsx'
import PerfectScrollbar from 'react-perfect-scrollbar'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles(theme => ({
  root: {
    userSelect: 'none',
    whiteSpace: 'normal',
    height: '100%',
    display: 'inline-flex',
    flexDirection: 'column',
    verticalAlign: 'top',
    width: 300,
    padding: theme.spacing(0, 1),
    margin: theme.spacing(0, 1)
    // [theme.breakpoints.down('xs')]: {
    //   width: 240
    // }
  },
  isDraggingOver: {},
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(0.5, 2),
    borderRadius: 4,
    display: 'flex',

    alignItems: 'center',
    cursor: 'pointer'
  },
  counter: {
    marginLeft: theme.spacing(1)
  },
  headerAction: {
    marginLeft: 'auto'
  },
  content: {
    flexGrow: 1,
    overflowY: 'hidden'
  },
  inner: {
    padding: theme.spacing(2, 3)
  }
}))

function GroupList({ title, total, provided, snapshot, className, children, ...rest }) {
  const classes = useStyles()
  const [collapse, setCollapse] = useState(false)

  const handleCollapse = () => {
    setCollapse(!collapse)
  }

  return (
    <div {...rest} className={clsx(classes.root, className)} ref={provided.innerRef}>
      <div className={classes.header} onClick={handleCollapse}>
        <Typography color="inherit" variant="h6">
          {title}
        </Typography>
        <Typography className={classes.counter} color="inherit" variant="caption">
          - {total}
        </Typography>
        <div className={classes.headerAction}>
          <Tooltip arrow title={!collapse ? 'Thu lại' : 'Mở rộng'}>
            <IconButton color="inherit">{collapse ? <ExpandMoreIcon /> : <ExpandLessIcon />}</IconButton>
          </Tooltip>
        </div>
      </div>
      <div
        className={clsx(classes.content, {
          [classes.isDraggingOver]: snapshot.isDraggingOver
        })}
        hidden={collapse}>
        <PerfectScrollbar options={{ suppressScrollX: true }}>
          <div className={classes.inner}>{children}</div>
        </PerfectScrollbar>
      </div>
    </div>
  )
}

GroupList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  provided: PropTypes.object.isRequired,
  snapshot: PropTypes.object.isRequired,
  title: PropTypes.string,
  total: PropTypes.number
}

export default GroupList
