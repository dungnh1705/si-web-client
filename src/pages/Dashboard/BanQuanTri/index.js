import React, { Fragment } from 'react'
import { Suspense } from 'react'

import PhanDoanTruongDashboard from '../PhanDoanTruong'
import SelectionGroup from './components/SelectionGroup'

export default function BanQuanTrigDashboard() {
  return (
    <Fragment>
      <Suspense fallback={<>Đang tải danh sách Phân đoàn...</>}>
        <SelectionGroup />
      </Suspense>

      <Suspense fallback={<>Đang tải thống kê Phân đoàn...</>}>
        <PhanDoanTruongDashboard />
      </Suspense>
    </Fragment>
  )
}
