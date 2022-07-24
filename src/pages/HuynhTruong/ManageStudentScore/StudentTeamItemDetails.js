import React from 'react'
import { Grid, Typography} from '@material-ui/core'
import { useRecoilValue } from 'recoil'

import { WorkingSemester } from './recoil'
import StudentScoreDetails from './StudentScoreDetails'
import StudentTotalScoreDetails from './StudentTotalScoreDetails'

import { SemesterEnum } from 'app/enums'

const StudentTeamItemDetails = ({ student }) => {
  const workingSemester = useRecoilValue(WorkingSemester)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} style={{ alignSelf: 'center' }}>
        <Typography className="font-weight-bold" component="div">
          Thành tích học tập
        </Typography>
      </Grid>

      {workingSemester !== SemesterEnum.total && <StudentScoreDetails student={student} />}
      {workingSemester === SemesterEnum.total && <StudentTotalScoreDetails student={student} />}
    </Grid>
  )
}

export default StudentTeamItemDetails
