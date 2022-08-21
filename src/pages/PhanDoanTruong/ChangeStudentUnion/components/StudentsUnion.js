import React, { useState } from 'react'
import { Card, Grid, Tooltip, IconButton, Divider, CardContent } from '@material-ui/core'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { StudentStatus } from 'app/enums'

import StudentsUnionTeam from './StudentsUnionTeam'
import StudentsUnionTeamItem from './StudentsUnionTeamItem'

const StudentsUnion = ({ union }) => {
  const [collapse, setCollapse] = useState(true)

  const distinctTeam = [...new Set(union.students.map(stu => stu.studentClass.find(sc => sc.classId === stu.classId && sc.unionId === union.unionId)?.team))]
  const studentsInTeam = []

  for (const t of distinctTeam) {
    studentsInTeam.push({ team: t, students: [] })
  }

  for (const stu of union.students)
    studentsInTeam.forEach(item => {
      if (item.team === stu.studentClass.find(sc => sc.classId === stu.classId && sc.unionId === union.unionId)?.team) {
        item.students.push(stu)
      }
    })

  const filterAbsent = () => {
    studentsInTeam.forEach(item => {
      if (item.team !== 0) item.students = item.students.filter(stu => stu.status === StudentStatus.Active)
    })

    return studentsInTeam
  }

  return (
    <Card className="card-box mb-1 w-100">
      <div className="card-header d-flex pb-1 pt-1 header__active" onClick={() => setCollapse(!collapse)}>
        <div className="card-header--title">
          {union.unionId === 1 && <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Chưa phân Chi đoàn - {union.students?.length}</h4>}
          {union.unionId !== 1 && (
            <h4 className="font-size-lg mb-0 py-1 font-weight-bold">
              Chi đoàn: {union.unionCode} - {union.students?.length}
            </h4>
          )}
        </div>
        <Grid container item xs={4} justifyContent="flex-end">
          <div className="card-header--actions">
            <Tooltip arrow title={!collapse ? 'Thu lại' : 'Mở rộng'}>
              <IconButton size="medium" color="primary">
                {collapse ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            </Tooltip>
          </div>
        </Grid>
      </div>
      <Divider />
      {union.unionId === 1 && (
        <div className="table-responsive" hidden={collapse}>
          <table className="table table-hover text-nowrap mb-0">
            <thead>
              <tr>
                <th></th>
                <th>STT</th>
                <th>Tên Thánh, Họ và Tên</th>
              </tr>
            </thead>
            <tbody>
              {[...union.students]
                .sort((a, b) => a.stuGender - b.stuGender || a.stuLastName.localeCompare(b.stuLastName))
                .map((stu, index) => (
                  <StudentsUnionTeamItem key={`stu-team-no-union-${stu.id}`} student={stu} index={index + 1} />
                ))}
            </tbody>
          </table>
        </div>
      )}
      {union.unionId !== 1 && (
        <CardContent hidden={collapse}>
          {[...filterAbsent()].map((team, index) => (
            <StudentsUnionTeam key={`union-${union.unionId}-team-${index}`} team={team} unionId={union.unionId} />
          ))}
        </CardContent>
      )}
    </Card>
  )
}

export default StudentsUnion
