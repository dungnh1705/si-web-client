import React, { useState } from 'react'
import { Grid, Card, Tooltip, IconButton, Divider, ButtonGroup, Button } from '@material-ui/core'
import { useRecoilValue } from 'recoil'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import StudentTeamItem from './StudentTeamItem'
import { ViewMode } from 'recoils/atoms'
import { ViewModes, StudentStatus, AbsentMode } from 'app/enums'

const StudentTeam = ({ item }) => {
  const [collapse, setCollapse] = useState(true)
  const viewMode = useRecoilValue(ViewMode)
  const [viewAbsentMode, setViewAbsentMode] = useState(AbsentMode.Mass)

  const handleCollapse = () => {
    setCollapse(!collapse)
  }

  return (
    <Card className="card-box mb-1 w-100">
      <div className="card-header d-flex pb-1 pt-1" onClick={handleCollapse} style={{ cursor: 'pointer' }}>
        <div className="card-header--title">
          {item.team === 0 && <h4 className="font-size-lg mb-0 py-2 font-weight-bold">Chưa phân đội - {item?.students?.length}</h4>}
          {item.team !== 0 && (
            <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
              Đội: {item.team} - {item?.students?.length} / {item?.students?.filter(i => i.status !== StudentStatus.Active)?.length}
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
      <div className="table-responsive" hidden={collapse}>
        <table className="table table-hover text-nowrap mb-0">
          <thead>
            <tr>
              {viewMode === ViewModes.XepDoi && (
                <>
                  <th rowSpan="2" className="td-center">
                    Đội
                  </th>
                  <th rowSpan="2" className="td-center">
                    STT
                  </th>
                </>
              )}
              <th rowSpan="2">Tên Thánh, Họ và Tên</th>
              <th colSpan="2" rowSpan={item.team !== 0 && viewMode === ViewModes.DiemDanh ? 1 : 2} className="td-center">
                {item.team !== 0 && viewMode === ViewModes.DiemDanh && (
                  <ButtonGroup variant="contained" aria-label="contained primary button group">
                    <Button color={viewAbsentMode === AbsentMode.Mass ? 'secondary' : 'default'} onClick={() => setViewAbsentMode(AbsentMode.Mass)}>
                      Lễ
                    </Button>
                    <Button color={viewAbsentMode === AbsentMode.Class ? 'secondary' : 'default'} onClick={() => setViewAbsentMode(AbsentMode.Class)}>
                      Học
                    </Button>
                  </ButtonGroup>
                )}
              </th>
            </tr>
            <tr>
              {item.team !== 0 && viewMode === ViewModes.DiemDanh && (
                <>
                  <th className="td-center">P</th>
                  <th className="td-center">KP</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {item.students.length > 0 &&
              [...item.students]
                .sort((a, b) => a.status - b.status || b.isTeamLead - a.isTeamLead || a.stuGender - b.stuGender || a.stuLastName.localeCompare(b.stuLastName))
                .map((stu, index) => <StudentTeamItem key={`stu-class-${stu.id}-${index}`} student={stu} team={item.team} viewAbsentMode={viewAbsentMode} index={index + 1} />)}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default StudentTeam
