import React, { Fragment, Suspense, useState } from 'react'
import { Grid, Card, Tooltip, IconButton, makeStyles, LinearProgress } from '@material-ui/core'
import { filter } from 'lodash'
import moment from 'moment'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { StudentStatus } from 'app/enums'

import StudentAttendanceItem from './StudentAttendanceItem'
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

const StudentAttendance = ({ team }) => {
  const classStyle = useStyle()
  const [collapse, setCollapse] = useState(true)

  const handleShowStudent = () => {
    setCollapse(!collapse)
  }

  const formatDate = (date) => {
    return moment.utc(date).format('DD/MM/YYYY')
  }

  const listSunday = useRecoilValue(LoadSundayList)
  const currentDate = moment()

  const filteredAndFormattedDates = listSunday
    .filter((date) => moment.utc(date) <= currentDate && moment.utc(date).month() > 7)
    .map((date) => formatDate(date))

  const LimitSundayList = listSunday.filter((date) => moment.utc(date) <= currentDate && moment.utc(date).month() > 7)

  return (
    <Grid item xs={12}>
      <Card className='card-box mb-2 w-100'>
        <div className='card-header d-flex pb-2 pt-2' onClick={handleShowStudent} style={{ cursor: 'pointer' }}>
          <div className='card-header--title'>
            <h4 className='font-size-lg mb-0 py-2 font-weight-bold'>Đội: {team.team}</h4>
          </div>
          <Grid container item xs={4} justifyContent='flex-end'>
            <div className='card-header--actions'>
              <Tooltip arrow title={!collapse ? 'Thu lại' : 'Mở rộng'}>
                <IconButton size='medium' color='primary'>
                  {collapse ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                </IconButton>
              </Tooltip>
            </div>
          </Grid>
        </div>
        <div className='table-responsive' hidden={collapse}>
          <table className='table table-hover text-nowrap mb-0'>
            <thead>
            <tr>
              <th className={classStyle.pinCell}></th>
              {filteredAndFormattedDates.map((stringDate) => (
                <th colSpan='2' style={{ borderLeft: '2px solid #dcdef1', textAlign: 'center' }}
                    key={`title-column-${team.team}-${stringDate}`}>{stringDate}</th>
              ))}
            </tr>
            <tr>
              <th className={classStyle.pinCell}>Tên Thánh, Họ và Tên</th>
              {filteredAndFormattedDates.map((stringDate) => (
                <Fragment key={`column-${team.team}-${stringDate}`}>
                  <th style={{ borderLeft: '2px solid #dcdef1', textAlign: 'center' }}>Lễ</th>
                  <th style={{ borderLeft: '2px solid #dcdef1', textAlign: 'center' }}>Học</th>
                </Fragment>
              ))}
            </tr>
            </thead>
            <tbody>
            {filter(team?.students, { status: StudentStatus.Active })
              .sort((a, b) => a.stuGender - b.stuGender || a.stuLastName.localeCompare(b.stuLastName))
              .map((student, index) => (
                <Suspense fallback={<LinearProgress />} key={`attendance-student-${student.id}`}>
                  <StudentAttendanceItem student={student} id={index}
                                         SundayList={LimitSundayList} />
                </Suspense>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Grid>
  )
}

export default StudentAttendance
