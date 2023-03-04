import React from 'react'
import { useRecoilValue } from 'recoil'
import { Grid, Typography } from '@material-ui/core'

// states
import { HolyNameQuery } from 'recoils/selectors'
import { AssignmentOfUnionSelector } from 'pages/BanQuanTri/GroupInfo/recoil'

// utils
import StringUtils from 'utils/StringUtils'

export default function UnionAssignmentInfo() {
  const holyNames = useRecoilValue(HolyNameQuery)
  const users = useRecoilValue(AssignmentOfUnionSelector)
  console.log(users)

  if (!users || users.length === 0) return <></>

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" className="mb-3">
      <Grid item xs={12}>
        <Typography variant="h4">HUYNH TRƯỞNG PHỤ TRÁCH</Typography>
      </Grid>

      <Grid container item xs={12} justifyContent="center" className="mt-1 mb-2">
        {users.map(user => (
          <Grid item xs={12} sm={6} lg={4} key={user.id} className="text-center">
            <Typography variant="h3">
              {StringUtils.holyNameLookup(holyNames, user.holyNameId)} {user.firstName} {user.lastName}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}
