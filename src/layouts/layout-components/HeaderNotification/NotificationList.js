import React, { useState, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { useTheme, useMediaQuery } from '@material-ui/core'

import { Notifications, loadNotification } from 'recoils/atoms'
import { doGet } from 'utils/axios'

import EmptyNotification from './component/EmptyNotification'
import NotificationItem from './NotificationItem'

export default function NotificationList({ userId, total, open, tab }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))

  const [pageSize, setPageSize] = useState(5)
  const [scrollPos, seScrollPos] = useState(0)
  const divRef = useRef()

  const [notifications, setNotifications] = useRecoilState(Notifications)
  const loadNoti = useRecoilValue(loadNotification)

  useEffect(() => {
    async function fetchNotification() {
      try {
        const response = await doGet('notification/userNotification', {
          userId,
          PageSize: pageSize
        })
        const { data } = response.data
        tab === 1 ? setNotifications(data.filter(item => item.isRead === false)) : setNotifications(data)
      } catch (error) {}
    }
    if (open === true) fetchNotification()
  }, [pageSize, loadNoti, tab])

  const handeScroll = () => {
    const currentScrollPos = divRef.current.scrollTop
    if (currentScrollPos > scrollPos) {
      pageSize < total && setPageSize(pageSize + 3)
    }
    seScrollPos(currentScrollPos)
  }

  return (
    <div
      className={!isMobile ? 'popover-custom-xl overflow-hidden' : 'popover-custom-lg overflow-hidden'}
      style={{
        width: isMobile ? '100%' : '360px'
      }}>
      <div
        ref={divRef}
        onScroll={handeScroll}
        tabIndex={0}
        style={{
          width: isMobile ? '90vw' : '100%',
          height: total === 0 ? '280px' : 'auto',
          maxHeight: total > 0 ? '500px' : 'none',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '8px'
        }}>
        {total === 0 ? <EmptyNotification /> : Array.from({ length: total }).map((_, index) => <NotificationItem notification={notifications[index]} key={index} />)}
      </div>
    </div>
  )
}
