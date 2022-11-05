import React, { Fragment } from 'react'
import { Suspense } from 'react'

import PageSkeleton from 'components/Loading/page-skeleton'
import SelectionGroup from './components/SelectionGroup'
import BanQuanTriMainDashboard from './components'

export default function BanQuanTrigDashboard() {
  return (
    <Fragment>
      <Suspense fallback={<>Đang tải danh sách Phân đoàn...</>}>
        <SelectionGroup />
      </Suspense>

      <Suspense fallback={<PageSkeleton />}>
        <BanQuanTriMainDashboard />
      </Suspense>
    </Fragment>
  )
}
