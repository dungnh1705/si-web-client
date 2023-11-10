// import React from 'react'
// import { Grid, Typography} from '@material-ui/core'
// import { useRecoilValue } from 'recoil'

// import { WorkingSemester } from './recoil'
// import StudentScoreDetails from './StudentScoreDetails'
// import StudentTotalScoreDetails from './StudentTotalScoreDetails'

// import { SemesterEnum } from 'app/enums'

// const StudentTeamItemDetails = ({ student }) => {
//   const workingSemester = useRecoilValue(WorkingSemester)

//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12} style={{ alignSelf: 'center' }}>
//         <Typography className="font-weight-bold" component="div">
//           Thành tích học tập
//         </Typography>
//       </Grid>

//       {workingSemester !== SemesterEnum.total && <StudentScoreDetails student={student} />}
//       {workingSemester === SemesterEnum.total && <StudentTotalScoreDetails student={student} />}
//     </Grid>
//   )
// }

// export default StudentTeamItemDetails


//

//import StudentTeamItemDetails from './StudentTeamItemDetails'
import StudentTotalScoreDetails from './StudentTotalScoreDetails'
//
import React, { Suspense, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import RowSkeleton from 'components/Loading/row-skeleton'

import { TeamScoreSelected } from './recoil'
//import StudentUnionTeamBodyItem from 'pages/PhanDoanTruong/ManageScoreGroup/StudentUnionTeamBodyItem'
import { doGet } from 'utils/axios'

import sessionHelper from 'utils/sessionHelper'

const StudentTeamItemDetails = ({ team }) => {
  const teamSelected = useRecoilValue(TeamScoreSelected)
  const  { classId, scholasticId, unionId } = sessionHelper();

  const [ids, setIds] = useState([])

  useEffect(() => {
    async function fetchData(teamId) {
      const res = await doGet('student/getStudentIdsInTeam', { classId: sessionHelper().classId, unionId: unionId, team: teamId })
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
