import React, { Fragment, Suspense } from 'react'

import PageSkeleton from 'components/Loading/page-skeleton'

import GroupListSection from 'pages/BanQuanTri/GroupInfo/components/GroupListSection'
import GroupSummaryInfo from 'pages/BanQuanTri/GroupInfo/components/GroupSummaryInfo'
import GroupUnionList from 'pages/BanQuanTri/GroupInfo/components/GroupUnionList'
import UnionStudentInfo from 'pages/BanQuanTri/GroupInfo/components/UnionStudentInfo'
import UnionAssignmentInfo from 'pages/BanQuanTri/GroupInfo/components/UnionAssignmentInfo'

import { TeacherInfoDialog } from 'components/Dialog'

export default function GroupInfo() {
  return (
    <Fragment>
      <Suspense fallback={<>Loading....</>}>
        <GroupListSection />
      </Suspense>

      <Suspense fallback={<PageSkeleton />}>
        <GroupSummaryInfo />
      </Suspense>

      <Suspense fallback={<PageSkeleton />}>
        <GroupUnionList />
      </Suspense>

      <Suspense fallback={<PageSkeleton />}>
        <UnionAssignmentInfo />
      </Suspense>

      <Suspense fallback={<PageSkeleton />}>
        <UnionStudentInfo />
      </Suspense>
      {/*  DIALOG*/}
      <>
        <TeacherInfoDialog />
      </>
    </Fragment>
  )
}
