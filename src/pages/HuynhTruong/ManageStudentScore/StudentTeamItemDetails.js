import StudentTotalScoreDetails from './StudentTotalScoreDetails'
//
import React, { Suspense, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import RowSkeleton from 'components/Loading/row-skeleton'

import { TeamScoreSelected } from './recoil'
import StudentUnionTeamBodyItem from 'pages/PhanDoanTruong/ManageScoreGroup/StudentUnionTeamBodyItem'
import { doGet } from 'utils/axios'

import sessionHelper from 'utils/sessionHelper'

const StudentTeamItemDetails = ({ team }) => {
  const teamSelected = useRecoilValue(TeamScoreSelected)
  const { classId, scholasticId, unionId } = sessionHelper()

  const [ids, setIds] = useState([])

  useEffect(() => {
    async function fetchData(teamId) {
      const res = await doGet('student/getStudentIdsInTeam', {
        classId: sessionHelper().classId,
        unionId: unionId,
        team: teamId
      })
      if (res && res.data.success) {
        const { data } = res.data
        setIds(data)
      }
    }

    if (teamSelected.includes(team)) {
      fetchData(team)
    }
  }, [teamSelected])

  return (
    <>
      {ids?.map(id => (
        <Suspense fallback={<RowSkeleton />} key={`body-team-${id}`}>
          <StudentTotalScoreDetails studentId={id} />
        </Suspense>
      ))}
    </>
  )
}

export default StudentTeamItemDetails
