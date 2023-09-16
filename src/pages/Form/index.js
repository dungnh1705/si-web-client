import React, { Fragment, Suspense } from 'react'
import DocumentList from './components/DocumentList'
import GroupSelectedStudent from './components/GroupSelectedStudent'
import sessionHelper from 'utils/sessionHelper'
import { Roles } from 'app/enums'
import { LinearProgress } from '@material-ui/core'
import UnionSelectedStudent from './components/UnionSelectedStudent'

export default function FormDownload() {
  const roles = sessionHelper().roles
  console.log(roles)
  const render = () => {
    const isLeadOfGroup = roles.includes(Roles.PhanDoanTruong)
    if (isLeadOfGroup) {
      return <GroupSelectedStudent />
    } else {
      return <UnionSelectedStudent />
    }
  }

  return <Fragment>
    <Suspense fallback={<>Đang tải danh sách biểu mẫu...</>}>
      <DocumentList />
    </Suspense>
    <br />

    <Suspense fallback={<LinearProgress />}>
      {render()}
    </Suspense>
  </Fragment>
}
