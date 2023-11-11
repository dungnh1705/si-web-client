import React, { Fragment } from 'react'
import { useRecoilValue } from 'recoil'

import { SundayVisible } from './recoil'
import AttendanceItemDetails from './components/AttendanceItemDetails'
import { HolyNameQuery } from 'recoils/selectors'


const StudentAttendanceItem = ({ studentIds }) => {
  const lstHolyName = useRecoilValue(HolyNameQuery)
  const sundayVisible = useRecoilValue(SundayVisible)
  return (
    <Fragment>
      {studentIds.map(id => (
        <AttendanceItemDetails SundayList={sundayVisible} lstHolyName={lstHolyName} studentId={id} key={`item-details-${id}`} />
      ))}
    </Fragment>
  )
}

export default StudentAttendanceItem
