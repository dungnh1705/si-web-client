import React, { useState, useEffect } from 'react'
import { Typography } from '@material-ui/core'
import { useRecoilState } from 'recoil'

import StyledCheckbox from 'components/UI/StyledCheckbox'

import { StudentSelected } from '../recoil'
import { doGet } from 'utils/axios'

const StudentsUnionTeamItem = ({ id, index, union, team }) => {
  const [studentDetails, setStudentDetails] = useState({})

  useEffect(() => {
    async function getStudentDetails(id) {
      if (id) {
        const res = await doGet('student/getStudentDetails', { studentId: id })
        if (res && res.data.success) {
          setStudentDetails(res.data.data)
        }
      }
    }

    getStudentDetails(id).finally()
  }, [id])

  const [studentSelected, setStudentSelected] = useRecoilState(StudentSelected)

  const handleClickStudent = (e, stuId) => {
    e.preventDefault()

    if (studentSelected.some(stu => stu.stuId === id)) {
      setStudentSelected(studentSelected.filter(stu => stu.stuId !== stuId))
    } else {
      setStudentSelected([...studentSelected, { stuId, union, team }])
    }
  }

  return (
    <tr className="align-items-center tr__active" onClick={e => handleClickStudent(e, id)}>
      <td>
        <StyledCheckbox checked={studentSelected.some(stu => stu.stuId === id)} />
      </td>
      <td>{index}</td>
      <td>
        <Typography>
          {studentDetails?.stuHolyname?.name}
          <br />
          {studentDetails?.stuFirstName} {studentDetails?.stuLastName}
        </Typography>
      </td>
    </tr>
  )
}

export default StudentsUnionTeamItem
