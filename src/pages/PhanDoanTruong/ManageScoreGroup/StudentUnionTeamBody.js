import React, { Suspense, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import RowSkeleton from 'components/Loading/row-skeleton'

import { TeamScoreSelected, UnionScoreSelected } from 'pages/PhanDoanTruong/ManageScoreGroup/recoil'
import StudentUnionTeamBodyItem from 'pages/PhanDoanTruong/ManageScoreGroup/StudentUnionTeamBodyItem'
import { doGet } from 'utils/axios'

import sessionHelper from 'utils/sessionHelper'

const StudentUnionTeamBody = ({ team }) => {
  const teamSelected = useRecoilValue(TeamScoreSelected)
  const unionSelected = useRecoilValue(UnionScoreSelected)

  const [ids, setIds] = useState([])

  useEffect(() => {
    async function fetchData(teamId) {
      const res = await doGet('student/getStudentIdsInTeam', {
        classId: sessionHelper().classId,
        unionId: unionSelected,
        team: teamId
      })
      if (res && res.data.success) {
        const { data } = res.data
        setIds(data)
      }
    }

    if (teamSelected.includes(team)) {
      fetchData(team).finally()
    }
  }, [teamSelected])

  return (
    <>
      {ids?.map(id => (
        <Suspense fallback={<RowSkeleton />} key={`body-team-${id}`}>
          <StudentUnionTeamBodyItem studentId={id} />
        </Suspense>
      ))}
    </>
  )
}

export default StudentUnionTeamBody
