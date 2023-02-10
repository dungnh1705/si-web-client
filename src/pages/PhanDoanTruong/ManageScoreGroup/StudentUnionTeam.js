import { Card, Grid, Tooltip, IconButton, Divider, Table, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { SemesterEnum } from 'app/enums'

import { SemesterSelected, TeamScoreSelected } from 'pages/PhanDoanTruong/ManageScoreGroup/recoil'
import StudentUnionTeamBody from './StudentUnionTeamBody'

const columns = [
  { id: 1, label: 'Miệng', align: 'center' },
  {
    id: 2,
    label: '15\u0027',
    align: 'center'
  },
  {
    id: 3,
    label: '1 tiết',
    align: 'center'
  },
  {
    id: 4,
    label: 'HK',
    align: 'center'
  },
  {
    id: 5,
    label: 'TB HK',
    align: 'center'
  },
  {
    id: 6,
    label: 'Xếp loại',
    align: 'center'
  }
]

const columnsTotal = [
  { id: 1, label: 'TB HKI', align: 'center' },
  { id: 2, label: 'TB HKII', align: 'center' },
  { id: 3, label: 'TB Cả năm', align: 'center' },
  { id: 4, label: 'Xếp loại', align: 'center' }
]

const useStyle = makeStyles({
  pinCell: {
    position: 'sticky',
    left: 0,
    zIndex: 1,

    '&::after': {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '2.5px',
      zIndex: 2,
      content: '""',
      backgroundColor: '#E5E6F5'
    }
  }
})

const StudentUnionTeam = ({ team, totalStudents }) => {
  const styleClass = useStyle()
  const [collapse, setCollapse] = useState(true)

  const semester = useRecoilValue(SemesterSelected)
  const setTeamSelected = useSetRecoilState(TeamScoreSelected)

  function handleClickTeam() {
    setTeamSelected(items => [...new Set([...items, team])])
    setCollapse(!collapse)
  }

  return (
    <Card className="card-box mb-3 w-100">
      <div className="card-header d-flex pb-1 pt-1" onClick={handleClickTeam} style={{ cursor: 'pointer' }}>
        <div className="card-header--title">
          {team === 0 && <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Chưa phân đội - {totalStudents}</h4>}
          {team !== 0 && (
            <h4 className="font-size-lg mb-0 py-1 font-weight-bold">
              Đội: {team} - {totalStudents}
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
        <Table stickyHeader aria-label="sticky table" className="table text-nowrap table-hover mb-0">
          <thead>
            <tr>
              <th rowSpan="3" align="left" className={styleClass.pinCell}>
                Tên Thánh, Họ và Tên
              </th>
              <th colSpan={semester !== SemesterEnum.total ? 6 : 4} style={{ textAlign: 'center' }}>
                Học tập
              </th>
              <th colSpan="4" style={{ textAlign: 'center' }}>
                Chuyên cần
              </th>
              <th rowSpan="3" align="center">
                Đạo đức
              </th>
              <th rowSpan="3" align="center">
                Nhận xét đánh giá
              </th>
              {semester === SemesterEnum.total && (
                <th rowSpan="3" align="center">
                  Lên lớp
                </th>
              )}
            </tr>
            <tr>
              {semester !== SemesterEnum.total &&
                columns.map(column => (
                  <th key={column.id} align={column.align} style={{ minWidth: column.minWidth }} rowSpan="2">
                    {column.label}
                  </th>
                ))}
              {semester === SemesterEnum.total &&
                columnsTotal.map(column => (
                  <th key={column.id} align={column.align} style={{ minWidth: column.minWidth }} rowSpan="2">
                    {column.label}
                  </th>
                ))}
              <th colSpan="2" style={{ textAlign: 'center' }}>
                Học GL
              </th>
              <th colSpan="2" style={{ textAlign: 'center' }}>
                Lễ CN
              </th>
            </tr>
            <tr>
              <th align="center">P</th>
              <th align="center">KP</th>
              <th align="center">P</th>
              <th align="center">KP</th>
            </tr>
          </thead>
          <tbody>
            <StudentUnionTeamBody team={team} />
          </tbody>
        </Table>
      </div>
    </Card>
  )
}

export default StudentUnionTeam
