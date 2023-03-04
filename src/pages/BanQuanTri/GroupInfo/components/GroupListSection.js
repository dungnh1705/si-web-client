import React, { useState, useEffect } from 'react'
import { Grid, InputLabel, Select, MenuItem, Typography, Hidden } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'

import { GroupSelected } from 'pages/BanQuanTri/GroupInfo/recoil'
import { totalGroupSummaryQuery } from 'pages/Dashboard/recoil'
import sessionHelper from 'utils/sessionHelper'

import HeaderDownload from './HeaderDownload'

export default function GroupListSection() {
  const { classId } = sessionHelper()

  const classes = useRecoilValue(totalGroupSummaryQuery)

  const [groupSelected, setGroupSelected] = useRecoilState(GroupSelected)
  const [val, setVal] = useState(classId !== 0 ? classId : classes[0].id)

  const handleMenuChange = e => {
    const selectedVal = e.target.value
    setVal(selectedVal)
  }

  useEffect(() => {
    if (classId !== 0) {
      setGroupSelected(classes.find(cl => cl.id === classId))
    } else {
      setGroupSelected(classes[0])
    }
  }, [])

  useEffect(() => {
    setGroupSelected(classes.find(cl => cl.id === Number(val)))
  }, [val])

  return (
    <Grid container spacing={2} className="mb-3 mt-3">
      <Grid item xs={12} sm={5} md={2}>
        <InputLabel id="label">Chọn Phân đoàn</InputLabel>
        <Select labelId="label" id="select" variant="outlined" fullWidth onChange={handleMenuChange} value={val}>
          {classes.map(cl => (
            <MenuItem value={cl.id} key={cl.id}>
              {cl.group.groupName}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12} sm={1} />
      <Grid container item xs={12} sm={6} md={8} justifyContent="center">
        <Grid item xs={12}>
          <InputLabel id="label-pdt">Phân đoàn trưởng:</InputLabel>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3">
            {groupSelected?.leader?.holyName?.name ?? ''} {groupSelected?.leader?.firstName ?? ''} {groupSelected?.leader?.lastName ?? ''}
          </Typography>
        </Grid>
      </Grid>
      <Hidden smDown>
        <Grid container spacing={1} item xs={1} justifyContent="flex-end" alignItems="center">
          <HeaderDownload />
        </Grid>
      </Hidden>
    </Grid>
  )
}
