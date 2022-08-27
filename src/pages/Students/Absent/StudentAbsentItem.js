import React, { Suspense } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash'

// External
import { Roles } from 'app/enums'
import { HolyNameQuery } from 'recoils/selectors'
import StyledCheckbox from 'components/UI/StyledCheckbox'
import sessionHelper from 'utils/sessionHelper'

// Internal
import { ShowConfirmDialog, AbsentSelected } from './recoil'

const mystyle = makeStyles({
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
      content: "\"\"",
      backgroundColor: '#E5E6F5'
    }
  }
})

const StudentAbsentItem = ({ month, mode }) => {
  const useStyle = mystyle();
  const lstHolyName = useRecoilValue(HolyNameQuery)
  const [open, setOpen] = useRecoilState(ShowConfirmDialog)
  const setAbsent = useSetRecoilState(AbsentSelected)

  const lstStudent = _.chain(
    _.orderBy(
      month?.item.filter(i => i.absentMode === mode),
      item => item.student.stuLastName,
      ['asc']
    )
  )
    .groupBy('studentId')
    .map((value, key) => ({ id: key, absents: value }))
    .value()

  const lstWeek = _.orderBy(
    _.chain(month?.item)
      .groupBy('dateAbsent')
      .map((value, key) => ({ date: key }))
      .value(),
    ['date'],
    ['asc']
  )

  const handleRemove = (e, ab) => {
    e.target.checked = true
    const stuUnionId = ab.student.studentClass.find(sc => Number(sc.class.scholasticId) === Number(sessionHelper().scholasticId))?.unionId

    if (Number(sessionHelper().unionId) === Number(stuUnionId) || (Number(sessionHelper().unionId) === 0 && sessionHelper().roles.includes(Roles.PhanDoanTruong))) {
      setOpen(!open)
      setAbsent(ab)
    }
  }

  return (
    <>
      {lstStudent?.map(stu => (
        <tr key={`stu-absent-${stu.id}`}>
          <td className={useStyle.pinCell}>
            {lstHolyName?.find(h => h.id === stu?.absents[0].student.stuHolyId)?.name} {stu?.absents[0].student.stuFirstName} {stu?.absents[0].student.stuLastName}
          </td>
          <td style={{ textAlign: 'center' }}>
            <b>{stu?.absents?.filter(ab => ab.hasPermission)?.length}</b>
          </td>
          <td style={{ textAlign: 'center' }}>
            <b>{stu?.absents?.filter(ab => !ab.hasPermission)?.length}</b>
          </td>
          {lstWeek?.map((week, i) => {
            let absent = stu?.absents?.find(ab => ab.dateAbsent === week.date)
            if (absent) {
              return absent.hasPermission ? (
                <Suspense key={`${stu.id}-ab-row-p-${i++}`}>
                  <td style={{ textAlign: 'center' }}>
                    <StyledCheckbox defaultChecked onClick={e => handleRemove(e, absent)} />
                  </td>
                  <td></td>
                </Suspense>
              ) : (
                <Suspense key={`${stu.id}-ab-row-kp-${i++}`}>
                  <td></td>
                  <td style={{ textAlign: 'center' }}>
                    <StyledCheckbox defaultChecked onClick={e => handleRemove(e, absent)} />
                  </td>
                </Suspense>
              )
            } else {
              return <td key={`${stu.id}ab-row-empty-${i++}`} colSpan="2"></td>
            }
          })}
        </tr>
      ))}
    </>
  )
}

export default StudentAbsentItem
