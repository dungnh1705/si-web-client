import React, { useState } from 'react'
import { Grid, Card, Tooltip, IconButton } from '@material-ui/core'
import _ from 'lodash'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import StudentTeamItem from './StudentTeamItem'

const StudentTeam = ({ team }) => {
  const [collapse, setCollapse] = useState(true)

  const handleShowStudent = () => {
    setCollapse(!collapse)
  }

  return (
    <Grid item xs={12}>
      <Card className="card-box mb-2 w-100">
        <div className="card-header d-flex pb-2 pt-2" onClick={handleShowStudent} style={{ cursor: 'pointer' }}>
          <div className="card-header--title">
            <h4 className="font-size-lg mb-0 py-2 font-weight-bold">Đội: {team.team}</h4>
          </div>
          <Grid container item xs={4} justifyContent="flex-end">
            <div className="card-header--actions">
              <Tooltip arrow title={!collapse ? 'Thu lại' : 'Mở rộng'}>
                <IconButton size='medium' color="primary">{collapse ? <ExpandMoreIcon /> : <ExpandLessIcon />}</IconButton>
              </Tooltip>
            </div>
          </Grid>
        </div>
        <div className="table-responsive" hidden={collapse}>
          <table className="table table-hover text-nowrap mb-0">
            <thead>
              <tr>
                <th>Mã ĐS</th>
                <th>Tên Thánh, Họ và Tên</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {_.orderBy(team?.students, ['stuLastName'], ['asc']).map((stu, index) => (
                <StudentTeamItem key={`score-${index + 98}`} student={stu} id={index} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Grid>
  )
}

export default StudentTeam
