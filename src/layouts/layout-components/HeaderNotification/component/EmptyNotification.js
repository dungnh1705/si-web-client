import React from 'react'
import { NotificationsPausedRounded } from '@material-ui/icons'

export default function EmptyNotification() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '50%' }}>
      <NotificationsPausedRounded style={{ fontSize: '100px' }} />
      <span className="font-weight-bold">Bạn không có thông báo nào</span>
    </div>
  )
}
