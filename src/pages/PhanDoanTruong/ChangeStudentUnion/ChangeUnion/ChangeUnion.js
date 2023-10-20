import { Grid, TextField, InputAdornment, MenuItem } from '@material-ui/core'

import React, { useEffect } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { UnionRightSide, UnionLeftSide, StudentsQuery, StudentSelected } from '../recoil'

import Transition from '../components/Transition'
import StudentUnion from './StudentsUnion'

export default function ChangeUnion() {
  const studentsUnion = useRecoilValue(StudentsQuery)
  const [studentIdsSelected, setStudentIdsSelected] = useRecoilState(StudentSelected)

  const [leftUnion, setLeftUnion] = useRecoilState(UnionLeftSide)
  const [rightUnion, setRightUnion] = useRecoilState(UnionRightSide)

  useEffect(() => {
    setLeftUnion(studentsUnion[0]?.unionId)
    setRightUnion(studentsUnion[0]?.unionId)
  }, [])

  const handleChangeUnionOptionLeft = e => {
    const unionIdSelected = e.target.value
    setStudentIdsSelected(studentIdsSelected.filter(stu => stu.union !== leftUnion))
    setLeftUnion(unionIdSelected)
  }

  const handleChangeUnionOptionRight = e => {
    const unionIdSelected = e.target.value
    setStudentIdsSelected(studentIdsSelected.filter(stu => stu.union !== rightUnion))
    setRightUnion(unionIdSelected)
  }

  return (
    <Grid item xs={12} spacing={3} container justifyContent="flex-start">
      <Grid item xs={12} sm={12} lg={5}>
        <TextField
          variant="outlined"
          fullWidth
          select
          InputProps={{
            startAdornment: <InputAdornment position="start">{leftUnion === 1 ? '' : 'Chi đoàn:'}</InputAdornment>
          }}
          value={leftUnion}
          onChange={handleChangeUnionOptionLeft}
          style={{ textAlign: 'center' }}>
          {studentsUnion?.map((option, i) => {
            if (option.unionId !== rightUnion || option.unionId === 1) {
              return (
                <MenuItem value={option.unionId} key={`union-${i}`}>
                  {option.unionId === 1 ? 'Chưa phân chi đoàn' : option.unionCode}
                  {` - ${option.students.length}`}
                </MenuItem>
              )
            }
          })}
        </TextField>
        <StudentUnion unionId={leftUnion} />
      </Grid>

      <Grid item lg={2} container alignItems="center">
        <Transition leftOption={leftUnion === 1 ? 0 : leftUnion} rightOption={rightUnion === 1 ? 0 : rightUnion} />
      </Grid>

      <Grid item xs={12} sm={12} lg={5}>
        <TextField
          variant="outlined"
          fullWidth
          select
          InputProps={{
            startAdornment: <InputAdornment position="start">{rightUnion === 1 ? '' : 'Chi đoàn:'}</InputAdornment>
          }}
          value={rightUnion}
          onChange={handleChangeUnionOptionRight}
          style={{ textAlign: 'center' }}>
          {studentsUnion?.map((option, i) => {
            if (option.unionId !== leftUnion || option.unionId === 1) {
              return (
                <MenuItem value={option.unionId} key={`union-${i}`}>
                  {option.unionId === 1 ? 'Chưa phân chi đoàn' : option.unionCode}
                  {` - ${option.students.length}`}
                </MenuItem>
              )
            }
          })}
        </TextField>
        <StudentUnion unionId={rightUnion} />
      </Grid>
    </Grid>
  )
}
