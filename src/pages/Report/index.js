import React, { Suspense } from 'react'
import ReportList from './ReportList'
import ReportViewer from './ReportViewer'

export default function Report() {
  return (
    <Suspense fallback={<>Đang tải danh sách báo cáo...</>}>
      <ReportList />
      
      <ReportViewer />
    </Suspense>
  )
}
