import React from 'react'
import { useRecoilValue } from 'recoil'

import StudentUnionTeam from 'pages/PhanDoanTruong/ManageScoreGroup/StudentUnionTeam'
import { GetUnionTeamsInfoSelector } from 'pages/PhanDoanTruong/ManageScoreGroup/recoil'

const StudentUnion = () => {
  const teams = useRecoilValue(GetUnionTeamsInfoSelector)

  return (
    <>
      {teams?.map(item => (
        <StudentUnionTeam team={item.team} totalStudents={item.totalStudents} key={`StudentUnionTeam-${item.team}`} />
      ))}
    </>
  )
}

export default StudentUnion
