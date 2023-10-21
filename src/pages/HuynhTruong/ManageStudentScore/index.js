/*
import React, { Suspense, useEffect } from 'react'
import { Grid, Typography, ButtonGroup, Button, Hidden } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'

import { PageYOffset } from 'recoils/atoms'

import { StudentListQuery, WorkingSemester } from './recoil'
import HeaderAction from './HeaderAction'
import StudentTeam from './StudentTeam'

import { ScoreDownloadDialog, ChooseFileDialog } from 'components/Dialog'
import ModalSkeleton from 'components/Loading/modal-skeleton'
import { Semester } from 'app/enums'
*/
//start
import React, { Suspense, useEffect } from 'react'
import { Grid, ButtonGroup, Button, Hidden, Typography, CardContent } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Slider from 'react-slick'
import { Semester } from 'app/enums'
import { ChooseFileDialog, GroupScoreResultDialog } from 'components/Dialog'
import { UnionQuery } from 'recoils/selectors'

import { SemesterSelected, UnionScoreSelected } from './recoil'
import HeaderAction from './HeaderAction'
//import StudentUnion from 'pages/PhanDoanTruong/ManageScoreGroup/StudentUnion'
//custome
import StudentTeam from './StudentTeam'
//
import PageSkeleton from 'components/Loading/page-skeleton'
import sessionHelper from 'utils/sessionHelper'
import { StudentListQuery } from './recoil'

  //end

const ManageStudentScore = () => {
  //add
  //start

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
   const  { classId, scholasticId, unionId } = sessionHelper();
  const [semester, setSemester] = useRecoilState(SemesterSelected)
  const [selectedUnion, setSelectedUnion] = useRecoilState(UnionScoreSelected)
  const lstUnion = useRecoilValue(UnionQuery)

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 2.5 : 4.5,
    slidesToScroll: isMobile ? 2 : 3,
    nextArrow: <></>,
    prevArrow: <></>
  }
  // function handleClickUnion(unionId) {
  //   setSelectedUnion(unionId)
  // }

  useEffect(() => {
    if (!selectedUnion) setSelectedUnion(unionId)
  }, [])

  const Body = () => {
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <ButtonGroup variant="contained" aria-label="contained primary button group">
              {Semester.map(s => (
                <Button key={s.Id} color={semester === s.Id ? 'primary' : 'default'} onClick={() => setSemester(s.Id)}>
                  {s.Name}
                </Button>
              ))}
            </ButtonGroup>
          </Grid>

          <Hidden xsDown>
            <Grid container item sm={3} justifyContent="flex-end">
              <HeaderAction />
            </Grid>
          </Hidden>
        </Grid>
        
        {/* <br />
        <Hidden xsDown>
          <ButtonGroup variant="contained" aria-label="contained primary button group" className={'mb-4'}>
            {lstUnion?.map(union => (
              <Button onClick={() => handleClickUnion(union.unionId)} key={union.unionId} color={selectedUnion === union.unionId ? 'primary' : 'default'} size={'large'}>
                Chi đoàn {union.unionCode}
              </Button>
            ))}
          </ButtonGroup>
        </Hidden>
        <Hidden smUp>
          <Slider {...settings}>
            {lstUnion &&
              lstUnion.map(union => (
                <CardContent onClick={() => handleClickUnion(union.unionId)} key={union.unionId}>
                  <Typography variant="h4" className={`carousel-header ${selectedUnion === union.unionId ? 'carousel-header__active' : ''}`}>
                    Chi đoàn {union.unionCode}
                  </Typography>
                </CardContent>
              ))}
          </Slider>
        </Hidden> */}
        <br />
        <Suspense fallback={<PageSkeleton />}>
          <StudentTeam />
        </Suspense>
      </div>
    )
  }
  return (
    <Suspense fallback={<>Đang tải Danh sách điểm ...</>}>
      <Body />

    
      <ChooseFileDialog />
      <GroupScoreResultDialog />
    </Suspense>
  )

   //end
  /*
  const lstStudent = useRecoilValue(StudentListQuery)
  const positionY = useRecoilValue(PageYOffset)
  
  const [workingSemester, setWorkingSemester] = useRecoilState(WorkingSemester)
  console.log(Semester);
  useEffect(() => {
    window.scroll(0, positionY)
  }, [lstStudent, positionY])

  const body = () => {
    return (
      <Grid container spacing={2}>
        
        {(!lstStudent || lstStudent?.length === 0) && (
          <Grid item xs={12}>
            <Typography variant="h4">Bạn chưa được phân Chi đoàn hoặc chưa có Đoàn sinh trong Chi đoàn.</Typography>
          </Grid>
        )}
      
        {lstStudent?.length > 0 && (
          <>
            <Grid item xs={12} sm={9}>
              <ButtonGroup variant="contained" aria-label="contained primary button group">
                {Semester.map(s => (
                  <Button key={s.Id} color={workingSemester === s.Id ? 'primary' : 'default'} onClick={() => setWorkingSemester(s.Id)}>
                    {s.Name}
                  </Button>
                ))}
              </ButtonGroup>
            </Grid>

            <Hidden xsDown>
              <Grid container item sm={3} justifyContent="flex-end">
                <HeaderAction />
              </Grid>
            </Hidden>

            {lstStudent.map(team => (
              <StudentTeam team={team} key={`score-team${team.team}`} />
            ))}
          </>
        )}
      </Grid>

    )
  }

  return (
    <Suspense fallback={<div>Đang tải danh sách điểm Đoàn sinh...</div>}>
      {body()}

      <Suspense fallback={<ModalSkeleton />}>
        <ScoreDownloadDialog />
        <ChooseFileDialog />
      </Suspense>
    </Suspense>
  )
  */
}

export default ManageStudentScore
