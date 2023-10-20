import { Grid, Button } from '@material-ui/core'
import { KeyboardArrowUp, KeyboardArrowDown, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

import React from 'react'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'

import { StudentSelected, TypeSelected, ReloadStudents } from '../recoil'
import { changeOptionEnum } from 'app/enums'
import sessionHelper from 'utils/sessionHelper'
import { doPost } from 'utils/axios'

export default function Transition({ leftOption, rightOption }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const typeSelected = useRecoilValue(TypeSelected)
  const setReloadStudents = useSetRecoilState(ReloadStudents)
  const [studentIdsSelected, setStudentIdsSelected] = useRecoilState(StudentSelected)

  const studentsLeftSide =
    typeSelected === changeOptionEnum.Union ? studentIdsSelected.filter(stu => stu.union === leftOption) : studentIdsSelected.filter(stu => stu.team === leftOption)
  const studentsRightSide =
    typeSelected === changeOptionEnum.Union ? studentIdsSelected.filter(stu => stu.union === rightOption) : studentIdsSelected.filter(stu => stu.team === rightOption)

  const sendData = async (destinationId, studentIdsMoved) => {
    const { classId, userId, scholasticId, fullName: modifiedBy } = sessionHelper()
    let api = 'student/'
    let data = {
      studentIds: studentIdsMoved,
      scholasticId,
      classId,
      modifiedBy,
      userId
    }
    if (typeSelected === changeOptionEnum.Union) {
      data = { ...data, newUnionId: destinationId }
      api += 'updateStudentsUnion'
    } else {
      data = { ...data, team: destinationId }
      api += 'updateStudentTeam'
    }

    try {
      const res = await doPost(api, data)
      if (res && res.data.success) {
        const remainStudentIds = studentIdsSelected.filter(stu => !studentIdsMoved.includes(stu.stuId))
        setStudentIdsSelected(remainStudentIds)
        setReloadStudents(prev => prev + 1)
      }
    } catch (err) {}
  }

  const handleForwardButtonClick = async () => {
    const destinationId = rightOption
    const studentIds = studentsLeftSide.map(stu => stu.stuId)
    await sendData(destinationId, studentIds)
  }

  const handleBackwardButtonClick = async () => {
    const destinationId = leftOption
    const studentIds = studentsRightSide.map(stu => stu.stuId)
    await sendData(destinationId, studentIds)
  }

  return (
    <Grid item container spacing={1} justifyContent="center" alignItems="center">
      <Grid item xs={6} sm={6} lg={12} container justifyContent="center" alignItems="center">
        <Button variant="contained" disabled={leftOption === rightOption || studentsLeftSide.length < 1 || rightOption === 0} onClick={handleForwardButtonClick}>
          {isMobile ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
        </Button>
      </Grid>
      <Grid item xs={6} sm={6} lg={12} container justifyContent="center" alignItems="center">
        <Button variant="contained" disabled={rightOption === leftOption || studentsRightSide.length < 1 || leftOption === 0} onClick={handleBackwardButtonClick}>
          {isMobile ? <KeyboardArrowUp /> : <KeyboardArrowLeft />}
        </Button>
      </Grid>
    </Grid>
  )
}
