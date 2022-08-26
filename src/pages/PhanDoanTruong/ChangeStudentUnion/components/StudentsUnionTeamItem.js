import React from 'react'
import { Typography } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'

import StyledCheckbox from 'components/UI/StyledCheckbox'

import { HolyNameQuery } from 'recoils/selectors'
import { StudentSelected } from '../recoil'

const StudentsUnionTeamItem = ({ student, index, isDestination }) => {
  const lstHolyname = useRecoilValue(HolyNameQuery)
  const [studentSelected, setStudentSelected] = useRecoilState(StudentSelected)

  const handleClickStudent = (e, stuId) => {
    e.preventDefault()

    if (studentSelected.some(v => v === student.id)) {
      setStudentSelected(studentSelected.filter(id => id !== stuId))
    } else {
      setStudentSelected([...studentSelected, stuId])
    }
  }

  return (
    <tr className="align-items-center tr__active" onClick={e => handleClickStudent(e, student.id)}>
      {!isDestination && (
        <td>
          <StyledCheckbox checked={studentSelected.some(v => v === student.id)} />
        </td>
      )}
      <td>{index}</td>
      <td>
        <Typography>
          {lstHolyname.find(h => h.id === student.stuHolyId).name}
          <br />
          {student.stuFirstName} {student.stuLastName}
        </Typography>
      </td>
    </tr>
  )
}

export default StudentsUnionTeamItem
