import React, { useState } from 'react'
import { Card, Grid, Tooltip, IconButton, CardContent, Divider } from '@material-ui/core'
import _ from 'lodash'
import { useRecoilValue } from 'recoil'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { ViewMode } from 'recoils/atoms'
import { ViewModes, StudentStatus } from 'app/enums'

import StudentTeam from './StudentTeam'
import StudentTeamItem from './StudentTeamItem'

const StudentGroup = ({ item }) => {
  const [collapse, setCollapse] = useState(true)
  const viewMode = useRecoilValue(ViewMode)
  const distinctTeam = [...new Set(item.students.map(x => x.studentClass.find(sc => sc.classId === x.classId && sc.unionId === item.unionId)?.team))]
  const lstStudentInTeam = [{ team: 0, students: [] }]

  for (const t of distinctTeam) {
    if (t !== 0) lstStudentInTeam.push({ team: t, students: [] })
  }

  for (const stu of item.students) {
    lstStudentInTeam.forEach(t => {
      if (t.team === stu.studentClass.find(sc => sc.classId === stu.classId && sc.unionId === item.unionId)?.team) {
        t.students.push(stu)
      }
    })
  }

  const filterAbsent = () => {
    if (viewMode === ViewModes.DanhSachNghi) {
      lstStudentInTeam.forEach(item => {
        if (item.team !== 0) item.students = item.students.filter(stu => stu.status !== StudentStatus.Active)
        else item.students = []
      })
    } else {
      lstStudentInTeam.forEach(item => {
        if (item.team !== 0) item.students = _.filter(item.students, { status: StudentStatus.Active })
      })
    }

    return lstStudentInTeam
  }

  const handleCollapse = () => {
    setCollapse(!collapse)
  }

  // console.log(lstStudentInTeam)

  return (
    <>
      {item?.students?.length > 0 && (
        <Card className="card-box mb-1 w-100">
          <div className="card-header d-flex pb-1 pt-1" onClick={handleCollapse} style={{ cursor: 'pointer' }}>
            <div className="card-header--title">
              {item.unionId === 1 && <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Đoàn sinh mới - {item?.students?.length}</h4>}
              {item.unionId !== 1 && (
                <h4 className="font-size-lg mb-0 py-1 font-weight-bold">
                  Chi đoàn: {item.unionCode} - {item?.students?.length} / {item?.students?.filter(i => i.status !== StudentStatus.Active)?.length}
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
          {item.unionId === 1 && (
            <div className="table-responsive" hidden={collapse}>
              <table className="table table-hover text-nowrap mb-0">
                <thead>
                  <tr>
                    {viewMode === ViewModes.XepChiDoan && <th>CĐ</th>}
                    <th>Tên Thánh, Họ và Tên</th>
                  </tr>
                </thead>
                <tbody>
                  {_.orderBy(item.students).map((stu, index) => (
                    <StudentTeamItem key={`stu-team-no-union-${stu.id}`} student={stu} unionId={item.unionId} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {item.unionId !== 1 && (
            <CardContent hidden={collapse}>
              {_.orderBy(filterAbsent(), ['team'], ['asc']).map((team, index) => (
                <StudentTeam item={team} key={`stu-team-union-${item.unionId}-${index}`} unionId={item.unionId} />
              ))}
            </CardContent>
          )}
        </Card>
      )}
    </>
  )
}

export default StudentGroup
