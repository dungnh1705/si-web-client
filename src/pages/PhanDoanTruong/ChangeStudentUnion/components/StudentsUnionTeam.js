import React, { useState } from 'react'
import { Card, Grid, Tooltip, IconButton, Divider } from '@material-ui/core'
import { useRecoilState } from 'recoil'
import { union } from 'lodash'
//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import StyledCheckbox from 'components/UI/StyledCheckbox'

import StudentsUnionTeamItem from './StudentsUnionTeamItem'
import { StudentSelected } from '../recoil'

const StudentsUnionTeam = ({ team, isDestination }) => {
  const [collapse, setCollapse] = useState(true)

  const [studentIds, setStudentIds] = useRecoilState(StudentSelected)

  const handleCheckAll = e => {
    const lstId = team?.students.map(s => s.id)

    if (e.target.checked) {
      const res = union(studentIds, lstId)
      setStudentIds(res)
    } else {
      setStudentIds(studentIds.filter(i => !lstId.includes(i)))
    }
  }

  const handleChecked = () => {
    const teamStudentIds = team?.students.map(s => s.id)
    const checked = studentIds.filter(id => teamStudentIds.includes(id))

    if (checked.length === teamStudentIds.length) return true
    return false
  }

  return (
    <Card className="card-box mb-1 w-100">
      <div className="card-header d-flex pb-1 pt-1 header__active" onClick={() => setCollapse(!collapse)}>
        <div className="card-header--title">
          {team?.team === 0 && <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Chưa phân đội - {team?.students?.length}</h4>}
          {team?.team !== 0 && (
            <h4 className="font-size-lg mb-0 py-1 font-weight-bold">
              Đội: {team?.team} - {team?.students?.length}
            </h4>
          )}
        </div>
        <Grid container item xs={3} justifyContent="flex-end">
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
      <div className="table-responsive" hidden={collapse}>
        <table className="table table-hover text-nowrap mb-0">
          <thead>
            <tr>
              {!isDestination && (
                <th>
                  <StyledCheckbox checked={handleChecked()} onChange={handleCheckAll} />
                </th>
              )}
              <th>STT</th>
              <th>Tên Thánh, Họ và Tên</th>
            </tr>
          </thead>
          <tbody>
            {team?.students?.length < 0 && <>Chưa có Đoàn sinh</>}
            {team?.students
              .sort((a, b) => a.stuGender - b.stuGender || a.stuLastName.localeCompare(b.stuLastName))
              .map((stu, index) => (
                <StudentsUnionTeamItem key={`stu-team-item-${stu.id}`} student={stu} index={index + 1} isDestination={isDestination} />
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default StudentsUnionTeam
