import { Hidden, LinearProgress, makeStyles } from '@material-ui/core'
import { AbsentMode, absentTypeOptionsEnum } from 'app/enums'
import React, { Fragment, useEffect, useState } from 'react'
import ControlledOpenSelect from '../Selection'
import moment from 'moment/moment'

import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { Skeleton } from '@material-ui/lab'

import { SumAbsent } from './SumAbsent'

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

export default function ({ lstHolyName, SundayList, studentId }) {
  const classStyle = useStyle()
  const [studentInfo, setStudentInfo] = useState()
  const [countAbsents, setCountAbsents] = useState()

  useEffect(() => {
    async function fetchData() {
      const { classId, scholasticId } = sessionHelper()
      const res = await doGet(`student/absents`, { studentId, classId, scholasticId })

      if (res && res.data.success) {
        setStudentInfo(res.data.data)
      }
    }

    if (!studentInfo) {
      fetchData().finally()
    }
  }, [studentInfo])

  useEffect(() => {
    async function fetchData() {
      const { classId, scholasticId } = sessionHelper()
      const res = await doGet(`student/count-absents`, { studentId, classId, scholasticId })

      if (res && res.data.success) {
        setCountAbsents(res.data.data)
      }
    }

    if (studentInfo && !countAbsents) {
      fetchData().finally()
    }
  }, [countAbsents, studentInfo])

  const checkAbsentDatesOfStudentHasCoincideSundayDate = (sunday, absentDates) => {
    const currentAbsents = absentDates?.filter(absent => moment.utc(absent.dateAbsent).date() === moment.utc(sunday).date())

    return [currentAbsents?.find(ab => ab.absentMode === AbsentMode.Mass) ?? null, currentAbsents?.find(ab => ab.absentMode === AbsentMode.Class) ?? null]
  }

  const handleReloadCountAbsents = () => {
    setCountAbsents(null)
  }

  if (!studentInfo)
    return (
      <tr>
        <td colSpan={10}>
          <Skeleton />
        </td>
      </tr>
    )

  return (
    <tr style={{ cursor: 'pointer', textAlign: 'center' }}>
      <td className={classStyle.pinCell} style={{ textAlign: 'left' }}>
        {lstHolyName.find(h => h.id === studentInfo?.stuHolyId)?.name ?? ''}&nbsp;
        <Hidden mdUp>
          <br />
        </Hidden>
        {studentInfo?.stuFirstName} {studentInfo?.stuLastName}
      </td>
      <SumAbsent totalAbsents={countAbsents} />
      {SundayList.map(date => {
        const [massAbsent, classAbsent] = checkAbsentDatesOfStudentHasCoincideSundayDate(date, studentInfo?.absents)
        const massPermission = massAbsent ? (massAbsent.hasPermission ? absentTypeOptionsEnum.Permission : absentTypeOptionsEnum.NonPermission) : absentTypeOptionsEnum.NoAbsent
        const classPermission = classAbsent ? (classAbsent.hasPermission ? absentTypeOptionsEnum.Permission : absentTypeOptionsEnum.NonPermission) : absentTypeOptionsEnum.NoAbsent

        return (
          <Fragment key={`absent-checkbox-${studentId}-${date}`}>
            <td>
              <ControlledOpenSelect
                Permission={massPermission}
                date={date}
                dropdownAbsentMode={AbsentMode.Mass}
                studentId={studentId}
                absentObj={massAbsent}
                handleReload={handleReloadCountAbsents}
              />
            </td>
            <td>
              <ControlledOpenSelect
                Permission={classPermission}
                date={date}
                dropdownAbsentMode={AbsentMode.Class}
                studentId={studentId}
                absentObj={classAbsent}
                handleReload={handleReloadCountAbsents}
              />
            </td>
          </Fragment>
        )
      })}
    </tr>
  )
}
