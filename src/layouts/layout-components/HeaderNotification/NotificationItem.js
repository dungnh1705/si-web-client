import React from 'react'
import { useRecoilState } from 'recoil'
import moment from 'moment'
import 'moment/locale/vi'

import { Grid, Typography, useMediaQuery, makeStyles } from '@material-ui/core'

import { loadNotification, loadNumUnReadNoti } from 'recoils/atoms'
import { doPut } from 'utils/axios'

import NotificationSkeleton from './component/NotificationSkeleton'
import { NotificationTypeIcon } from './component/NotificationTypeIcon'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  container: {
    '&:hover': {
      background: '#d2d3d6',
      borderRadius: '8px',
      cursor: 'pointer'
    }
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },

  medium: {
    width: theme.spacing(4),
    height: theme.spacing(4)
  },

  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'blue',
    position: 'absolute',
    top: '5px',
    right: '5px'
  }
}))

export default function NotificationItem({ notification }) {
  const classes = useStyles()
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const [loadNoti, setLoadNoti] = useRecoilState(loadNotification)
  const [loadNumUnRead, setLoadNumUnRead] = useRecoilState(loadNumUnReadNoti)

  if (!notification) {
    return <NotificationSkeleton isMobile={isSmallScreen} />
  }

  const setIsRead = async () => {
    try {
      await doPut('notification/markIsRead', { notificationId: notification.id })
      setLoadNoti(loadNoti + 1)
      setLoadNumUnRead(loadNumUnRead + 1)
    } catch (error) {}
  }

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      gap={4}
      style={{
        position: 'relative',
        padding: isSmallScreen ? '3px' : '7px'
      }}
      className={!isSmallScreen ? classes.container : ''}
      onClick={() => setIsRead()}>
      <Grid item xs={1} md={2} lg={2}>
        {NotificationTypeIcon[notification.type]}
      </Grid>
      <Grid item xs={10} md={9} lg={9}>
        <div>
          <Typography variant="h5" color="textPrimary" style={{ fontWeight: 'bold', paddingLeft: '12px' }}>
            {notification.title}
          </Typography>
          <div style={{ paddingLeft: '12px', fontWeight: notification?.isRead === false && 'bold' }}>
            <span>{notification.message}</span>
          </div>
          <div style={{ paddingLeft: '12px' }}>
            <span style={{ color: 'blue' }}>{moment(notification.createdDate).locale('vi').fromNow()}</span>
          </div>
        </div>
      </Grid>
      <Grid item xs={1} md={1} lg={1}>
        {notification?.isRead === false && <div className={classes.dot}></div>}
      </Grid>
    </Grid>
  )
}
