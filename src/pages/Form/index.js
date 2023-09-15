import React, { Fragment, Suspense } from 'react'
import DocumentList from './components/DocumentList'
import GroupSelectedStudent from './components/GroupSelectedStudent'

export default function FormDownload() {
  return <Fragment>
    <Suspense fallback={<>Đang tải danh sách biểu mẫu...</>}>
      <DocumentList />
    </Suspense>
    <br />
    <Suspense fallback={<>Đang tải danh sách chi đoàn...</>}>
      <GroupSelectedStudent />
    </Suspense>

  </Fragment>
}
