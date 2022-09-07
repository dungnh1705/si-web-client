import { Card, Grid, Tooltip, IconButton, Divider, Table, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import { filter } from 'lodash'
import { useRecoilValue } from 'recoil'

import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import StudentUnionItem from './StudentUnionItem'
import { SemesterSelected } from './recoil'
import { SemesterEnum, StudentStatus } from 'app/enums'

import { v4 as uuidv4 } from 'uuid'

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
      content: "\"\"",
      backgroundColor: '#E5E6F5'
    }
  }
})

const StudentUnionTeam = ({ item }) => {
  let [collapse, setCollapse] = useState(true)
  let semester = useRecoilValue(SemesterSelected)

  let styleClass = useStyle()

  return (
    <>
      {item?.students.length > 0 && (
        <Card className="card-box mb-1 w-100">
          <div className="card-header d-flex pb-1 pt-1" onClick={() => setCollapse(!collapse)} style={{ cursor: 'pointer' }}>
            <div className="card-header--title">
              {item.team === 0 && <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Chưa phân đội - {item?.students?.length}</h4>}
              {item.team !== 0 && (
                <h4 className="font-size-lg mb-0 py-1 font-weight-bold">
                  Đội: {item.team} - {item?.students?.length}
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
            <Table stickyHeader aria-label="sticky table" className="table table-hover mb-0">
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
                {filter(item.students, { status: StudentStatus.Active })
                  .sort((a, b) => a.stuGender - b.stuGender || a.stuLastName.localeCompare(b.stuLastName))
                  .map(stu => (
                    <StudentUnionItem key={`stu-score-item-${uuidv4()}`} student={stu} />
                  ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </>
  )
}

export default StudentUnionTeam
