import React, { Fragment } from 'react'
import { useRecoilValue } from 'recoil'

import StudentUnionTeam from 'pages/PhanDoanTruong/ManageScoreGroup/StudentUnionTeam'
import { GetUnionTeamsInfoSelector } from 'pages/PhanDoanTruong/ManageScoreGroup/recoil'
import { GroupSettingsQuery } from 'recoils/selectors'

const StudentUnion = () => {
  const teams = useRecoilValue(GetUnionTeamsInfoSelector)
  const groupSettings = useRecoilValue(GroupSettingsQuery)

  return (
    <Fragment>
      {teams?.map(item => (
        <StudentUnionTeam team={item.team} totalStudents={item.totalStudents} key={`StudentUnionTeam-${item.team}`} defaultScoreForm={groupSettings?.scoreForm} />
      ))}
    </Fragment>
  )
}

export default StudentUnion
