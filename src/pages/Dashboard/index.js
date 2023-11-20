import React, { useEffect } from 'react'
import { Suspense } from 'react'

import sessionHelper, { getLocalStorage } from 'utils/sessionHelper'
import { Roles } from 'app/enums'
import StringUtils from 'utils/StringUtils'

import HuynhTruongDashboard from './HuynhTruong'
import PhanDoanTruongDashboard from './PhanDoanTruong'
import BanQuanTrigDashboard from './BanQuanTri'
import { useRecoilValue } from 'recoil'
import { messageState } from 'recoils/firebase'
import { doPost } from '../../utils/axios'

const Dashboard = () => {
  const maxRole = StringUtils.getMaxRole(sessionHelper().roles)
  const notification = getLocalStorage('notification')
  const firebaseMessage = useRecoilValue(messageState)

  useEffect(() => {
    if (notification == 'granted') {
      firebaseMessage
        .getToken()
        .then(currentToken => {
          doPost('notification/upsertNotificationToken', {
            userId: sessionHelper().userId,
            token: currentToken
          }).then(response => console.log(response))
        })
        .catch(err => console.log(err))
    }
  }, [])

  return (
    <Suspense fallback={<>Đang tải dữ liệu...</>}>
      {maxRole === Roles.HuynhTruong && sessionHelper().unionId > 1 && <HuynhTruongDashboard />}
      {maxRole === Roles.HuynhTruong && sessionHelper().unionId === 1 && <h4>Bạn chưa được phân công Chi đoàn nên không có dữ liệu.</h4>}
      {maxRole === Roles.PhanDoanTruong && <PhanDoanTruongDashboard />}
      {maxRole === Roles.BanDieuHanh && <BanQuanTrigDashboard />}
    </Suspense>
  )
}

export default Dashboard
