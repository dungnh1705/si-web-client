import { Grid, Divider, Card, Tooltip, IconButton, CardContent } from '@material-ui/core'
import React, { useState } from 'react'
import _ from 'lodash'

// import purple from '@material-ui/core/colors/purple'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import StudentUnionTeam from './StudentUnionTeam'

import { v4 as uuidv4 } from 'uuid'

const StudentUnion = ({ union }) => {
  let [collapse, setCollapse] = useState(true)

  const distinctTeam = [...new Set(union.students.map(x => x.studentClass.find(sc => sc.classId === x.classId && sc.unionId === union.unionId)?.team))]
  const lstStudentInTeam = [{ team: 0, students: [] }]

  for (const t of distinctTeam) {
    if (t !== 0) lstStudentInTeam.push({ team: t, students: [] })
  }

  for (const stu of union.students) {
    lstStudentInTeam.forEach(t => {
      if (t.team === stu.studentClass.find(sc => sc.classId === stu.classId && sc.unionId === union.unionId)?.team) {
        t.students.push(stu)
      }
    })
  }

  return (
    <>
      {union?.students.length > 0 && (
        <Card className="card-box mb-1 w-100">
          <div className="card-header d-flex pb-1 pt-1" onClick={() => setCollapse(!collapse)} style={{ cursor: 'pointer' }}>
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 py-1 font-weight-bold">
                Chi đoàn: {union?.unionCode} - {union?.students.length}
              </h4>
            </div>
            <Grid container item xs={4} justifyContent="flex-end">
              <div className="card-header--actions">
                <Tooltip arrow title={!collapse ? 'Thu lại' : 'Mở rộng'}>
                  <IconButton size='medium' color="primary">{collapse ? <ExpandMoreIcon /> : <ExpandLessIcon />}</IconButton>
                </Tooltip>
              </div>
            </Grid>
          </div>
          <Divider />
          <CardContent hidden={collapse}>
            {_.orderBy(lstStudentInTeam, ['team'], ['asc']).map(team => (
              <StudentUnionTeam key={`score-team-${uuidv4()}`} item={team} />
            ))}
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default StudentUnion
