import React, { useState, useEffect } from 'react'
import { Grid, InputLabel, Select, MenuItem, Typography } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'

import { selectedClass, totalGroupSummaryQuery } from 'pages/Dashboard/recoil'
import sessionHelper from 'utils/sessionHelper'

const SelectionGroup = () => {
  const { classId } = sessionHelper()

  const classes = useRecoilValue(totalGroupSummaryQuery)
  const [selected, setSeleted] = useRecoilState(selectedClass)
  const [val, setVal] = useState(classId !== 0 ? classId : classes[0].id)

  const handleMenuChange = e => {
    const selectedVal = e.target.value
    setVal(selectedVal)
  }

  useEffect(() => {
    if (classId !== 0) {
      setSeleted(classes.find(cl => cl.id === classId))
    } else {
      setSeleted(classes[0])
    }
  }, [])

  useEffect(() => {
    setSeleted(classes.find(cl => cl.id === Number(val)))
  }, [val])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} />
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
            {selected?.leader?.holyName?.name ?? ''} {selected?.leader?.firstName ?? ''} {selected?.leader?.lastName ?? ''}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} />
      <Grid item xs={12} />
    </Grid>
  )
}

export default SelectionGroup
