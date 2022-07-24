import React from 'react'
import { Suspense } from 'react'
import _ from 'lodash'

import sessionHelper from 'utils/sessionHelper'
import { Roles } from 'app/enums'
import StringUtils from 'utils/StringUtils'

import HuynhTruongDashboard from './HuynhTruong'
import PhanDoanTruongDashboard from './PhanDoanTruong'
import BanQuanTrigDashboard from './BanQuanTri'

const Dashboard = () => {
  const maxRole = StringUtils.getMaxRole(sessionHelper().roles)

  return (
    <Suspense fallback={<>Đang tải dữ liệu...</>}>
      {maxRole === Roles.HuynhTruong && sessionHelper().unionId > 1 && <HuynhTruongDashboard />}
      {maxRole === Roles.HuynhTruong && sessionHelper().unionId === 1 && <h4>Bạn chưa được phân công Chi đoàn nên không có dữ liệu.</h4>}
      {maxRole === Roles.PhanDoanTruong && <PhanDoanTruongDashboard />}
      {maxRole === Roles.BanQuanTri && <BanQuanTrigDashboard />}
    </Suspense>
  )
}

export default Dashboard
