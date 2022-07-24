import React from 'react'
import clsx from 'clsx'
// import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core'
import moment from 'moment'
import _ from 'lodash'

const useStyles = makeStyles(theme => ({
  root: {
    outline: 'none',
    marginBottom: theme.spacing(1)
  },
  isDragging: {},
  content: {
    paddingTop: 0,
    paddingBottom: '5px !important'
  },
  stats: {
    display: 'flex',
    alignItems: 'center'
  },
  flexGrow: {
    flexGrow: 1
  },
  files: {
    color: theme.palette.icon,
    marginLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  comments: {
    color: theme.palette.icon,
    marginLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  date: {
    marginLeft: theme.spacing(2)
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  userCardHeader: {
    padding: '5px 12px'
  }
}))

const UserList = ({ user, onOpen, provided, snapshot, className, style, removeOnClass, ...rest }) => {
  const classes = useStyles()

  return (
    <Card
      {...rest}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={clsx(
        classes.root,
        {
          [classes.isDragging]: snapshot.isDragging
        },
        className
      )}
      style={{ ...style, ...provided.draggableProps.style }}
      onClick={onOpen}>
      <CardHeader
        subheader={`#${_.maxBy(user.roles, 'id').name}`}
        subheaderTypographyProps={{ variant: 'subtitle2' }}
        title={`${user.holyName?.name} ${user.firstName} ${user.lastName}`}
        titleTypographyProps={{ variant: 'subtitle2', gutterBottom: true }}
        className={classes.userCardHeader}
      />
      <CardContent className={classes.content}>
        <div className={classes.stats}>
          <div className={classes.flexGrow} />
          <Typography className={classes.date} color="textSecondary" variant="body2">
            {user.dob ? moment(user.dob).format('DD-MM-YYYY') : 'Chưa nhập'}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

// UserList.propTypes = {
//   className: PropTypes.string,
//   onOpen: PropTypes.func,
//   provided: PropTypes.object.isRequired,
//   snapshot: PropTypes.object.isRequired,
//   style: PropTypes.object,
//   user: PropTypes.object.isRequired,
//   removeOnClass: PropTypes.func
// }

// UserList.defaultProps = {
//   style: {},
//   onOpen: () => {}
// }

export default UserList
