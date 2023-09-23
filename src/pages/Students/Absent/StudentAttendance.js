import React, { useState } from 'react'
import { Grid, Card, Tooltip, IconButton, makeStyles } from '@material-ui/core'
import { filter } from 'lodash'
import moment from 'moment'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { StudentStatus } from 'app/enums'

import StudentTeamItem from './StudentAttendanceItem'
import { LoadSundayList } from './recoil'
import { useRecoilValue } from 'recoil'

const useStyle = makeStyles({
  pinCell: {
    position: 'sticky',
    left: 0,
    backgroundColor: 'white',
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

const StudentTeam = ({ team }) => {
  const classStyle = useStyle()
  const [collapse, setCollapse] = useState(true)

  const handleShowStudent = () => {
    setCollapse(!collapse)
  }

  const formatDate = (date) => {
    return date.format('DD/MM/YYYY')
  }

  const SundayList = useRecoilValue(LoadSundayList)
  const currentDate = new Date();

  const filteredAndFormattedDates = SundayList
    .map((isodate) => moment.utc(isodate))
    .filter((date) => date <= currentDate && date.month() > 7)
    .map((date) => formatDate(date));

  const LimitSundayList = SundayList
                                .map((isodate) => moment.utc(isodate))
                                .filter((date) => date <= currentDate && date.month() > 7)

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
                <IconButton size="medium" color="primary">
                  {collapse ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                </IconButton>
              </Tooltip>
            </div>
          </Grid>
        </div>
        <div className="table-responsive" hidden={collapse}>
          <table className="table table-hover text-nowrap mb-0">
            <thead>
              <tr>
                <th className={classStyle.pinCell}></th>
                {filteredAndFormattedDates.map((StrDate) => (
                  <th colSpan="2" style={{ borderLeft: '2px solid #dcdef1', textAlign: 'center' }} >{StrDate}</th>
                ))}
              </tr>
              <tr>
                <th className={classStyle.pinCell}>Tên Thánh, Họ và Tên</th>
                {filteredAndFormattedDates.map((date, index) => (
                  <>
                    <th style={{ borderLeft: '2px solid #dcdef1', textAlign: 'center'}}>Lễ</th>
                    <th style={{ borderLeft: '2px solid #dcdef1', textAlign: 'center'}}>Học</th>
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
            {filter(team?.students, { status: StudentStatus.Active })
              .sort((a, b) => a.stuGender - b.stuGender || a.stuLastName.localeCompare(b.stuLastName))
              .map((stu, index) => (
                <StudentTeamItem key={`attendance-${stu.id}`} student={stu} id={index} SundayList={LimitSundayList} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Grid>
  )
}

export default StudentTeam
