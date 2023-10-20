import { Grid, Button } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import React, { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import { UnionSelected, StudentsQuery, TeamLeftSide, TeamRightSide, ActiveButton } from '../recoil'

import SwipeableTextMobileStepper from '../components/CarouselUi'
import UnionTeam from './UnionTeam'

export default function ChangeTeam() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const studentsUnion = useRecoilValue(StudentsQuery)

  const filterUnion = studentsUnion.filter(su => su.unionId !== 1)

  const setUnionSelected = useSetRecoilState(UnionSelected)
  const [activeButton, setActiveButton] = useRecoilState(ActiveButton)
  const setLeftTeam = useSetRecoilState(TeamLeftSide)
  const setRightTeam = useSetRecoilState(TeamRightSide)

  useEffect(() => {
    //Auto select the first union button
    setActiveButton(filterUnion[0].unionId)
    setUnionSelected(filterUnion[0])
  }, [])

  const handleClickUnionOption = union => {
    setUnionSelected(union)
    setActiveButton(union.unionId)
    setLeftTeam(0)
    setRightTeam(0)
  }

  return (
    <>
      {isMobile ? (
        <SwipeableTextMobileStepper lstUnion={filterUnion} />
      ) : (
        <Grid item container spacing={2} justifyContent="center" alignItems="center">
          {filterUnion.map(union => {
            return (
              <Grid item xs={5} sm={2} lg={2} container justifyContent="center" alignItems="center">
                <Button
                  variant="contained"
                  color={activeButton === union.unionId ? 'primary' : 'default'}
                  onClick={() => handleClickUnionOption(union)}
                  style={{ whiteSpace: 'nowrap' }}>
                  Chi đoàn {union.unionCode} - {union?.students.length}
                </Button>
              </Grid>
            )
          })}
        </Grid>
      )}
      <UnionTeam key={'Teams of Union'} />
    </>
  )
}
