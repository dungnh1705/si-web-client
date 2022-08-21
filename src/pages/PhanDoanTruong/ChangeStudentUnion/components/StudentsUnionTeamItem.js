import React from 'react'
import { Typography } from '@material-ui/core'
import { useRecoilValue } from 'recoil'

import StyledCheckbox from 'components/UI/StyledCheckbox'

import { HolyNameQuery } from 'recoils/selectors'

const StudentsUnionTeamItem = ({ student, index }) => {
  const lstHolyname = useRecoilValue(HolyNameQuery)

  const handleClickStudent = () => {
    handleClickCheckbox()
  }

  const handleClickCheckbox = () => {}

  return (
    <tr className="align-items-center tr__active" onClick={handleClickStudent}>
      <td>
        <StyledCheckbox onClick={handleClickCheckbox} value={student.id} />
      </td>
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
