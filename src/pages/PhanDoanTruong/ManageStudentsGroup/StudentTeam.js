import React, { useState } from 'react'
import { Grid, Card, Tooltip, IconButton, Divider, ButtonGroup, Button } from '@material-ui/core'
import _ from 'lodash'
import { useRecoilValue } from 'recoil'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { ViewMode } from 'recoils/atoms'
import { ViewModes, AbsentMode } from 'app/enums'

import StudentTeamItem from './StudentTeamItem'

const StudentTeam = ({ item, unionId }) => {
  const viewMode = useRecoilValue(ViewMode)

  const [collapse, setCollapse] = useState(true)
  const [viewAbsentMode, setViewAbsentMode] = useState(AbsentMode.Mass)

  const handleCollapse = () => {
    setCollapse(!collapse)
  }

  return (
    <>
      {item?.students?.length > 0 && (
        <Card className="card-box mb-1 w-100">
          <div className="card-header d-flex pb-1 pt-1" onClick={handleCollapse} style={{ cursor: 'pointer' }}>
            <div className="card-header--title">
              {item.team === 0 && <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Chưa phân đội - {item?.students?.length}</h4>}
              {item.team !== 0 && (
                <h4 className="font-size-lg mb-0 py-1 font-weight-bold">
                  Đội: {item.team} - {item?.students?.length}
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
          {item?.students?.length > 0 && (
            <div className="table-responsive" hidden={collapse}>
              <table className="table table-hover text-nowrap mb-0">
                <thead>
                  <tr>
                    {viewMode === ViewModes.XepChiDoan && <th rowSpan="2">CĐ</th>}
                    <th rowSpan="2">STT</th>
                    <th rowSpan="2">Tên Thánh, Họ và Tên</th>
                    {viewMode === ViewModes.DiemDanh && (
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
                    )}
                    {viewMode === ViewModes.DanhSachNghi && <th rowSpan="2">Trạng thái</th>}
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
                  {_.orderBy(item.students, ['stuGender', 'stuLastName'], ['asc']).map((stu, index) => (
                    <StudentTeamItem key={`stu-team-item-${stu.id}`} student={stu} unionId={unionId} viewAbsentMode={viewAbsentMode} team={item.team} index={index + 1} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </>
  )
}

export default StudentTeam
