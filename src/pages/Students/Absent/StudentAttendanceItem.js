import React, { Fragment } from 'react'
import { useRecoilValue } from 'recoil'

import { LoadSundayList } from './recoil'
import AttendanceItemDetails from './components/AttendanceItemDetails'
import { HolyNameQuery } from 'recoils/selectors'
import moment from 'moment/moment'

const StudentAttendanceItem = ({ studentIds }) => {
  const lstHolyName = useRecoilValue(HolyNameQuery)
  const listSunday = useRecoilValue(LoadSundayList)

  const LimitSundayList = listSunday.filter(date => moment.utc(date) <= moment() && moment.utc(date).month() > 7)

  return (
    <Fragment>
      {studentIds.map(id => (
        <AttendanceItemDetails SundayList={LimitSundayList} lstHolyName={lstHolyName} studentId={id} key={`item-details-${id}`} />
      ))}
      {/*{showDetail.some(d => d === student.stuCode) && (*/}
      {/*  <tr style={{ backgroundColor: 'white' }}>*/}
      {/*    <td colSpan={7}>*/}
      {/*      <StudentTeamItemDetails student={student} key={student.stuCode + 1} />*/}
      {/*    </td>*/}
      {/*  </tr>*/}
      {/*)}*/}
    </Fragment>
  )
}

export default StudentAttendanceItem
