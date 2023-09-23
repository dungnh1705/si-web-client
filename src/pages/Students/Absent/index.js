import React, { Fragment, Suspense, useEffect } from 'react'
import {
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Card,
  Typography,
  ButtonGroup,
  Button,
  Hidden
} from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'

import ModalSkeleton from 'components/Loading/modal-skeleton'
import sessionHelper from 'utils/sessionHelper'
import { Roles, Semester } from 'app/enums'
import { UnionQuery } from 'recoils/selectors'

import { UnionCodeFilter, UnionSelected, StudentListQuery } from './recoil'
import AbsentForm from './AbsentForm'
import StudentAbsent from './StudentAbsent'
import ConfirmDialog from './ConfirmDialog'
import HeaderAction from './HeaderAction'
import StudentTeam from './StudentAttendance'
import { PageYOffset } from '../../../recoils/atoms'
import { WorkingSemester } from '../../HuynhTruong/ManageStudentScore/recoil'

const ManageAbsent = () => {
  const lstUnion = useRecoilValue(UnionQuery)
  const lstStudent = useRecoilValue(StudentListQuery)


  const [unionFilter, setUnionFilter] = useRecoilState(UnionCodeFilter)
  const [, setUnionSelected] = useRecoilState(UnionSelected)

  const positionY = useRecoilValue(PageYOffset)
  // const [workingSemester, setWorkingSemester] = useRecoilState(WorkingSemester)

  useEffect(() => {
    // get uninon of roles ky luat and hoc tap at first
    if (sessionHelper().roles.includes(Roles.KyLuat) || sessionHelper().roles.includes(Roles.HocTap)) {
      let unionCode = lstUnion?.find(u => Number(u.unionId) === Number(sessionHelper().unionId))?.unionCode
      if (unionCode) setUnionFilter(unionCode)
    }

    //Set the default union appearing first for role phan doan truong
    if (sessionHelper().roles.includes(Roles.PhanDoanTruong)){
      setUnionFilter(1)
      setUnionSelected(lstUnion[0].unionId)
    } else {
      setUnionSelected(sessionHelper().unionId)
    }
  }, [])

  useEffect(() => {
    window.scroll(0, positionY)
  }, [lstStudent, positionY])

  const canShowListUnion = () => {
    return sessionHelper().roles.includes(Roles.PhanDoanTruong) || sessionHelper().roles.includes(Roles.KyLuat) || sessionHelper().roles.includes(Roles.HocTap)
  }

  const handleChange = (e) => {
    setUnionFilter(e.target.value)

    //Get the unionId by taking the first union id and add the value of (union code - 1)
    setUnionSelected(lstUnion[0].unionId + e.target.value-1)
  }
  // const body = () => {
  //   return (
  //     <Fragment>
  //       <Grid container spacing={3} justifyContent="flex-start" alignItems="center">
  //         <Grid container item xs={9}>
  //           {canShowListUnion() && (
  //             <Grid>
  //               <Card>
  //                 <TextField
  //                   variant="outlined"
  //                   fullWidth
  //                   select
  //                   InputProps={{
  //                     startAdornment: <InputAdornment position="start">CĐ:</InputAdornment>
  //                   }}
  //                   value={unionFilter}
  //                   onChange={e => setUnionFilter(e.target.value)}>
  //                   {lstUnion?.map((option, i) => {
  //                     return (
  //                       <MenuItem key={`union-${i * 55}`} value={option.unionCode}>
  //                         {option.unionCode}
  //                       </MenuItem>
  //                     )
  //                   })}
  //                 </TextField>
  //               </Card>
  //             </Grid>
  //           )}
  //         </Grid>
  //         <Grid container item xs={3} justifyContent="flex-end" alignItems="center">
  //           <HeaderAction />
  //         </Grid>
  //       </Grid>
  //
  //       {lstAbsent?.length === 0 && (
  //         <Grid container item spacing={3}>
  //           <Grid item xs={12}>
  //             <Typography variant="h4">Chưa có danh sách ngày nghỉ của Đoàn sinh.</Typography>
  //           </Grid>
  //         </Grid>
  //       )}
  //
  //       {lstAbsent?.length > 0 && (
  //         <Grid container spacing={3} className="mt-3">
  //           {lstAbsent.map((ab, index) => {
  //             return <StudentAbsent month={ab} key={`class-absent-${ab.year}-${index}`} />
  //           })}
  //         </Grid>
  //       )}
  //     </Fragment>
  //   )
  // }
  const body = () => {
    return (
      <Grid container spacing={2}>
        {(!lstStudent || lstStudent?.length === 0) && (
          <Grid item xs={12}>
            <Typography variant="h4">Bạn chưa được phân Chi đoàn hoặc chưa có Đoàn sinh trong Chi đoàn.</Typography>
          </Grid>
        )}

        <Grid container spacing={3} justifyContent="flex-start" alignItems="center">
          <Grid container item xs={9}>
            {canShowListUnion() && (
              <Grid>
                <Card>
                  <TextField
                    variant="outlined"
                    fullWidth
                    select
                    InputProps={{
                      startAdornment: <InputAdornment position="start">CĐ:</InputAdornment>
                    }}
                    value={unionFilter}
                    onChange={e => handleChange(e)}>
                    {lstUnion?.map((option, i) => {
                      return (
                        <MenuItem key={`union-${i * 55}`} value={option.unionCode}>
                          {option.unionCode}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </Card>
              </Grid>
            )}
          </Grid>
          </Grid>
        {lstStudent?.length > 0 && (
          <>
            {/*<Grid item xs={12} sm={9}>*/}
            {/*  <ButtonGroup variant="contained" aria-label="contained primary button group">*/}
            {/*    {Semester.map(s => (*/}
            {/*      <Button key={s.Id} color={workingSemester === s.Id ? 'primary' : 'default'} onClick={() => setWorkingSemester(s.Id)}>*/}
            {/*        {s.Name}*/}
            {/*      </Button>*/}
            {/*    ))}*/}
            {/*  </ButtonGroup>*/}
            {/*</Grid>*/}

            {/*<Hidden xsDown>*/}
            {/*  <Grid container item sm={3} justifyContent="flex-end">*/}
            {/*    <HeaderAction />*/}
            {/*  </Grid>*/}
            {/*</Hidden>*/}

            {lstStudent.map(team => (
              <StudentTeam team={team} key={`score-team${team.team}`} />
            ))}
          </>
        )}
      </Grid>
    )
  }

  return (
    <Suspense fallback={<>Đang tải danh sách ngày nghỉ...</>}>
      {body()}
      {/*<Suspense fallback={<ModalSkeleton />}>*/}
      {/*  <AbsentForm />*/}
      {/*  <ConfirmDialog />*/}
      {/*</Suspense>*/}
    </Suspense>
  )
}

export default ManageAbsent
