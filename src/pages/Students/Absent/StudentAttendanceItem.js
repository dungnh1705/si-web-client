import React, { Fragment } from 'react'

import { makeStyles, Hidden } from '@material-ui/core'

import { useRecoilValue } from 'recoil'

import { HolyNameQuery } from 'recoils/selectors'
import ControlledOpenSelect from './Selection'

import { StudentAbsentListQuery } from './recoil'
import moment from 'moment'
import { AbsentMode, absentTypeOptionsEnum } from 'app/enums'

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

const StudentAttendanceItem = ({ student, SundayList }) => {
  const classStyle = useStyle()

  const lstHolyName = useRecoilValue(HolyNameQuery)
  const studentAbsentDates = useRecoilValue(StudentAbsentListQuery(student.id))

  const checkAbsentDatesOfStudentHasCoincideSundayDate = (sunday, absentDates) => {
    const currentAbsents = absentDates.filter(absent => moment.utc(absent.dateAbsent).date() === moment.utc(sunday).date())

    return [
      currentAbsents?.find(ab => ab.absentMode === AbsentMode.Mass) ?? null,
      currentAbsents?.find(ab => ab.absentMode === AbsentMode.Class) ?? null
    ]
  }

  return (
    <Fragment>
      <tr style={{ cursor: 'pointer', textAlign: 'center' }}>
        <td className={classStyle.pinCell} style={{ textAlign: 'left' }}>
          {lstHolyName.find(h => h.id === student.stuHolyId).name}&nbsp;
          <Hidden mdUp>
            <br />
          </Hidden>
          {student.stuFirstName} {student.stuLastName}
        </td>
        {SundayList.map((date) => {
            const [massAbsent, classAbsent] = checkAbsentDatesOfStudentHasCoincideSundayDate(date, studentAbsentDates)
            const massPermission = massAbsent ? massAbsent.hasPermission ? absentTypeOptionsEnum.Permission : absentTypeOptionsEnum.NonPermission : absentTypeOptionsEnum.NoAbsent
            const classPermission = classAbsent ? classAbsent.hasPermission ? absentTypeOptionsEnum.Permission : absentTypeOptionsEnum.NonPermission : absentTypeOptionsEnum.NoAbsent

            return (
              <Fragment key={`absent-checkbox-${student.id}-${date}`}>
                <td><ControlledOpenSelect Permission={massPermission}
                                          date={date} dropdownAbsentMode={AbsentMode.Mass}
                                          studentId={student.id}
                                          absentObj={massAbsent} /></td>

                <td><ControlledOpenSelect Permission={classPermission}
                                          date={date} dropdownAbsentMode={AbsentMode.Class}
                                          studentId={student.id}
                                          absentObj={classAbsent} /></td>
              </Fragment>
            )
          }
        )}


      </tr>
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
