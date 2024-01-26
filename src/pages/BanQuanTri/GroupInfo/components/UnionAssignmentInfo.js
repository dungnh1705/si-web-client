import React, { Fragment, Suspense } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Grid, LinearProgress, Typography } from '@material-ui/core'

// states
import { HolyNameQuery } from 'recoils/selectors'
import { AssignmentOfUnionSelector } from 'pages/BanQuanTri/GroupInfo/recoil'

// utils
import StringUtils from 'utils/StringUtils'
import { TeacherInfoDialogAtom } from 'components/Dialog/recoil'
import { doGet } from 'utils/axios'
import { TeacherInfoDialog } from 'components/Dialog'

export default function UnionAssignmentInfo() {
  const holyNames = useRecoilValue(HolyNameQuery)
  const users = useRecoilValue(AssignmentOfUnionSelector)
  const [infoDialog, setInfoDialog] = useRecoilState(TeacherInfoDialogAtom)

  if (!users || users.length === 0) return <></>

  async function handleShowInfo(userId) {
    const teacherInfo = await doGet('user/getUser', { userId: userId })
    if (teacherInfo && teacherInfo.data.success) {
      setInfoDialog({ ...infoDialog, open: true, info: teacherInfo.data.data })
    }
  }

  return (
    <Fragment>
      <Grid container spacing={2} justifyContent="center" alignItems="center" className="m-3">
        <Grid item xs={12}>
          <Typography variant="h4">HUYNH TRƯỞNG PHỤ TRÁCH</Typography>
        </Grid>

        <Grid container spacing={2} justifyContent="center" className="mt-1 mb-2" alignItems={'center'}>
          {users.map(user => (
            <Grid item xs={12} sm={6} lg={4} key={user.id} className="text-center">
              <Typography variant="h3" className="link__active" onClick={() => handleShowInfo(user.id)}>
                {StringUtils.holyNameLookup(holyNames, user.holyNameId)} {user.firstName} {user.lastName}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Suspense fallback={<LinearProgress />}>
        <TeacherInfoDialog />
      </Suspense>
    </Fragment>
  )
}
