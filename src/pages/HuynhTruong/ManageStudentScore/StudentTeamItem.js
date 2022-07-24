import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { StudentStatus } from 'app/enums'
import { HolyNameQuery } from 'recoils/selectors'

import StudentTeamItemDetails from './StudentTeamItemDetails'
import { ShowDetail } from './recoil'

const StudentTeamItem = ({ student }) => {
  const [showDetail, setShowDetail] = useRecoilState(ShowDetail)
  const lstHolyname = useRecoilValue(HolyNameQuery)

  const openDetail = code => {
    setShowDetail([...showDetail, code])
  }

  const closeDetail = code => {
    setShowDetail(showDetail.filter(i => i !== code))
  }

  const handleClickRow = e => {
    e.preventDefault()

    if (student.status !== StudentStatus.ChangeChurch && student.status !== StudentStatus.LeaveStudy)
      showDetail.some(d => d === student.stuCode) ? closeDetail(student.stuCode) : openDetail(student.stuCode)
  }

  return (
    <>
      <tr style={{ cursor: 'pointer' }} onClick={handleClickRow}>
        <td>{student.stuCode}</td>
        <td>
          {lstHolyname.find(h => h.id === student.stuHolyId).name} {student.stuFirstName} {student.stuLastName}
        </td>
        <td>
          {student.note}
          {student.status === StudentStatus.ChangeChurch && <span className="badge badge-danger">Chuyển xứ</span>}
          {student.status === StudentStatus.LeaveStudy && <span className="badge badge-warning">Nghỉ luôn</span>}
        </td>
      </tr>
      {showDetail.some(d => d === student.stuCode) && (
        <tr style={{ backgroundColor: 'white' }}>
          <td colSpan={7}>
            <StudentTeamItemDetails student={student} key={student.stuCode + 1} />
          </td>
        </tr>
      )}
    </>
  )
}

export default StudentTeamItem
