import StudentTeamItemDetails from './StudentTeamItemDetails'

import { Card, Grid, Tooltip, IconButton, Divider, Table, makeStyles, Hidden } from '@material-ui/core'
import React, { Fragment, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { ScoreFormTitle, SemesterEnum } from 'app/enums'

import { SemesterSelected, TeamScoreSelected } from './recoil'

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

const UnionTeamItem = ({ team, totalStudents, defaultScoreForm }) => {
  const styleClass = useStyle()
  const [collapse, setCollapse] = useState(true)

  const semester = useRecoilValue(SemesterSelected)
  const setTeamSelected = useSetRecoilState(TeamScoreSelected)

  function handleClickTeam() {
    setTeamSelected(items => [...new Set([...items, team])])
    setCollapse(!collapse)
  }

  const columns = () => {
    const scoreForm = JSON.parse(defaultScoreForm)
    const result = []

    scoreForm.map((item, index) =>
      result.push({
        id: index + 1,
        label: ScoreFormTitle[item.label],
        align: 'center'
      })
    )

    return result
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
                Tên Thánh,&nbsp;
                <Hidden mdUp>
                  <br />
                </Hidden>
                Họ và Tên
              </th>
              <th colSpan={semester !== SemesterEnum.total ? columns().length + 2 : 4} style={{ textAlign: 'center' }}>
                Học tập
              </th>
              <th rowSpan="3" style={{ textAlign: 'center' }}>
                Đạo đức
              </th>
              <th rowSpan="3" style={{ textAlign: 'center' }}>
                Nhận xét đánh giá
              </th>
              <th colSpan="4" style={{ textAlign: 'center' }}>
                Chuyên cần
              </th>
              {semester === SemesterEnum.total && (
                <th rowSpan="3" style={{ textAlign: 'center' }}>
                  Lên lớp
                </th>
              )}
            </tr>
            <tr>
              {semester !== SemesterEnum.total && (
                <Fragment>
                  {columns().map(column => (
                    <th key={column.id} align={column.align} style={{ minWidth: 50,textAlign: 'center' }} rowSpan="2">
                      {column.label}
                    </th>
                  ))}
                  <th rowSpan="2" style={{ textAlign: 'center' }}>
                    TB HK
                  </th>
                  <th rowSpan="2" style={{ textAlign: 'center' }}>
                    Học Lực
                  </th>
                </Fragment>
              )}

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
              <th style={{ textAlign: 'center' }}>P</th>
              <th style={{ textAlign: 'center' }}>KP</th>
              <th style={{ textAlign: 'center' }}>P</th>
              <th style={{ textAlign: 'center' }}>KP</th>
            </tr>
          </thead>
          <tbody>
            <StudentTeamItemDetails team={team} defaultScoreForm={defaultScoreForm} />
          </tbody>
        </Table>
      </div>
    </Card>
  )
}

export default UnionTeamItem
