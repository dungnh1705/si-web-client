import { Grid, TextField, InputAdornment, MenuItem } from '@material-ui/core'

import React, { useEffect, useState } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { UnionSelected, TeamLeftSide, TeamRightSide, StudentSelected } from '../recoil'

import Transition from '../components/Transition'
import TeamDetail from './TeamDetail'
import { doGet } from 'utils/axios'

const UnionTeam = () => {
  const unionSelected = useRecoilValue(UnionSelected)
  const [studentIdsSelected, setStudentIdsSelected] = useRecoilState(StudentSelected)
  const [lsTeam, setLsTeam] = useState([])

  useEffect(() => {
    async function fetchData() {
      const unionId = unionSelected?.unionId
      if (unionId) {
        const res = await doGet('assignment/getTeamInUnion', { unionId })
        const totalTeam = res.data.data
        setLsTeam(Array.from({ length: totalTeam }, (_, i) => i))
      }
    }

    fetchData().finally()
  }, [unionSelected])

  const [rightTeam, setRightTeam] = useRecoilState(TeamRightSide)
  const [leftTeam, setLeftTeam] = useRecoilState(TeamLeftSide)

  useEffect(() => {
    setRightTeam(0)
    setLeftTeam(0)
  }, [unionSelected])

  const handleChangeRight = e => {
    const value = e.target.value
    setStudentIdsSelected(studentIdsSelected.filter(stu => stu.team !== rightTeam))
    setRightTeam(value)
  }

  const handleChangeLeft = e => {
    const value = e.target.value
    setStudentIdsSelected(studentIdsSelected.filter(stu => stu.team !== leftTeam))
    setLeftTeam(value)
  }

  return (
    <>
      <Grid item xs={12} spacing={2} container justifyContent="flex-start">
        <Grid item xs={12} sm={12} lg={5}>
          <TextField
            variant="outlined"
            fullWidth
            select
            InputProps={{
              startAdornment: <InputAdornment position="start">{leftTeam !== 0 ? 'Đội:' : ''}</InputAdornment>
            }}
            value={leftTeam}
            onChange={e => handleChangeLeft(e)}
            style={{ textAlign: 'center' }}>
            {lsTeam?.map((team, i) => {
              if (team !== rightTeam || rightTeam === 0) {
                return (
                  <MenuItem value={team} key={`team-${i}`}>
                    {team !== 0 ? team : 'Chưa phân đội'}
                  </MenuItem>
                )
              }
            })}
          </TextField>

          <TeamDetail key={`left-${leftTeam}`} team={leftTeam} unionId={unionSelected.unionId} />
        </Grid>

        <Grid item xs={12} lg={2} container alignItems="center">
          <Transition leftOption={leftTeam} rightOption={rightTeam} />
        </Grid>

        <Grid item xs={12} sm={12} lg={5}>
          <TextField
            variant="outlined"
            fullWidth
            select
            InputProps={{
              startAdornment: <InputAdornment position="start">{rightTeam !== 0 ? 'Đội:' : ''}</InputAdornment>
            }}
            value={rightTeam}
            onChange={e => handleChangeRight(e)}
            style={{ textAlign: 'center' }}>
            {lsTeam?.map((team, i) => {
              if (team !== leftTeam || leftTeam === 0) {
                return (
                  <MenuItem value={team} key={`team-${i}`}>
                    {team !== 0 ? team : 'Chưa phân đội'}
                  </MenuItem>
                )
              }
            })}
          </TextField>

          <TeamDetail key={`right-${rightTeam}`} team={rightTeam} unionId={unionSelected.unionId} />
        </Grid>
      </Grid>
    </>
  )
}

export default UnionTeam
