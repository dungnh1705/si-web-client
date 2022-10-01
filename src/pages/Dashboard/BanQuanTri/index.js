import React, { Fragment } from 'react'
import { Suspense } from 'react'

import PhanDoanTruongDashboard from '../PhanDoanTruong'
import PageSkeleton from 'components/Loading/page-skeleton'
import SelectionGroup from './components/SelectionGroup'

export default function BanQuanTrigDashboard() {
  return (
    <Fragment>
      <Suspense fallback={<>Đang tải danh sách Phân đoàn...</>}>
        <SelectionGroup />
      </Suspense>

      <Suspense fallback={<PageSkeleton />}>
        <PhanDoanTruongDashboard />
      </Suspense>
    </Fragment>
  )
}
