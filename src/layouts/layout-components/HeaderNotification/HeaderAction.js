import React from 'react'

import { useRecoilValue, useRecoilState } from 'recoil'

import { Typography } from '@material-ui/core'
import { Done, CancelPresentation } from '@material-ui/icons'

import { Notifications, loadNotification, loadNumUnReadNoti, loadTotalNoti } from 'recoils/atoms'
import { doPut } from 'utils/axios'

import OptionMenu from './component/OptionMenu'
import sessionHelper from 'utils/sessionHelper'

export default function HeaderNotification() {
  const notifications = useRecoilValue(Notifications)
  const [loadNoti, setLoadNoti] = useRecoilState(loadNotification)
  const [loadNumUnRead, setLoadNumUnRead] = useRecoilState(loadNumUnReadNoti)
  const [loadTotal, setLoadTotal] = useRecoilState(loadTotalNoti)

  const options = [
    {
      label: 'Đánh dấu tất cả là đã đọc',
      icon: <Done />,
      action: () => setIsReadAll()
    },
    {
      label: 'Gỡ tất cả thông báo',
      icon: <CancelPresentation />,
      action: () => removeAllNotification()
    }
  ]

  const setIsReadAll = async () => {
    const userId = sessionHelper().userId
    try {
      await doPut('notification/markIsAllRead', { userId })
      setLoadNoti(loadNoti + 1)
      setLoadNumUnRead(loadNumUnRead + 1)
    } catch (err) {}
  }

  const removeAllNotification = async () => {
    if (notifications.length === 0) return
    const userId = sessionHelper().userId
    try {
      await doPut('notification/patch-updateStatus', { userId })
      setLoadNoti(loadNoti + 1)
      setLoadTotal(loadTotal + 1)
      setLoadNumUnRead(loadNumUnRead + 1)
    } catch (error) {}
  }

  return (
    <div className="d-flex justify-content-between align-items-center">
      <Typography
        variant="h4"
        className="font-weight-bold mb-3"
        style={{
          paddingLeft: '27px',
          paddingTop: '20px'
        }}>
        Thông báo
      </Typography>
      <OptionMenu options={options} />
    </div>
  )
}
