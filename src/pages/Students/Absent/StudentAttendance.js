import React, { Fragment, Suspense, useEffect, useState } from 'react'
import { Grid, Card, Tooltip, IconButton, makeStyles, LinearProgress } from '@material-ui/core'

import moment from 'moment'

//Icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import StudentAttendanceItem from './StudentAttendanceItem'
import { AbsentUnionSelected, SundaySelected, SundayVisible } from './recoil'
import { useRecoilState, useRecoilValue } from 'recoil'
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'

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
  },
  tableHeader: {
    borderLeft: '2px solid #dcdef1', 
    textAlign: 'center'
  },
})

const StudentAttendance = ({ team }) => {
  const classStyle = useStyle()
  const [collapse, setCollapse] = useState(true)
  const [stuIds, setStuIds] = useState([])


  const handleShowStudent = () => {
    setCollapse(!collapse)
  }

  const formatDate = (date) => {
    return moment.utc(date).format('DD/MM/YYYY')
  }

  const unionIdSelected = useRecoilValue(AbsentUnionSelected)

  const sundaySelected= useRecoilValue(SundaySelected)

  const [sundayVisible, setSundayVisible] = useRecoilState(SundayVisible)

  const FormattedDates = sundayVisible.map((date) => formatDate(date))


  const handleScroll = () => {
    if (sundayVisible.length === sundaySelected.length) return  

    setSundayVisible(sundaySelected)
  };

  useEffect(() => {
    async function fetchData(teamId) {
      const res = await doGet('student/getStudentIdsInTeam', {
        classId: sessionHelper().classId,
        unionId: unionIdSelected,
        team: teamId
      })
      if (res && res.data.success) {
        const { data } = res.data
        setStuIds(data)
      }
    }

    if (collapse === false) {
      fetchData(team.team).finally()
    }
  }, [collapse, team.team, unionIdSelected])

  useEffect(() => {
    //if there are more than 7 sundays, we will only show 7 sundays
    sundaySelected.length > 7 ? setSundayVisible(sundaySelected.slice(0, 7)) : setSundayVisible(sundaySelected);
  }, [sundaySelected])

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
        <div className='table-responsive' hidden={collapse} onScroll={handleScroll}>
          <table className='table table-hover text-nowrap mb-0'>
            <thead>
            <tr>
              <th className={classStyle.pinCell}></th>
              <th colSpan='2' className={classStyle.tableHeader}>Tổng</th>
              {FormattedDates.map((stringDate) => (
                <th colSpan='2'className={classStyle.tableHeader}
                    key={`title-column-${team.team}-${stringDate}`}>{stringDate}</th>
              ))}
            </tr>
            <tr>
              <th className={classStyle.pinCell}>Tên Thánh, Họ và Tên</th>
              <th className={classStyle.tableHeader}>Tổng Lễ</th>
              <th className={classStyle.tableHeader}>Tổng Học</th>
              {FormattedDates.map((stringDate) => (
                <Fragment key={`column-${team.team}-${stringDate}`}>
                  <th className={classStyle.tableHeader}>Lễ</th>
                  <th className={classStyle.tableHeader}>Học</th>
                </Fragment>
              ))}
            </tr>
            </thead>
            <tbody>
            <Suspense fallback={<LinearProgress />}>
              <StudentAttendanceItem studentIds={stuIds} />
            </Suspense>
            </tbody>
          </table>
        </div>
      </Card>
    </Grid>
  )
}

export default StudentAttendance
