import React, { useEffect } from 'react'
import { Grid, Card, TextField, InputAdornment, MenuItem } from '@material-ui/core'

import sessionHelper from 'utils/sessionHelper'
import { Roles } from 'app/enums'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AbsentUnionSelected, UnionCodeFilter } from './recoil'
import { UnionQuery } from 'recoils/selectors'

export default function HeaderAction() {
  const lstUnion = useRecoilValue(UnionQuery)
  const [unionFilter, setUnionFilter] = useRecoilState(UnionCodeFilter)
  const [, setUnionSelected] = useRecoilState(AbsentUnionSelected)


  useEffect(() => {
    // get uninon of roles ky luat and hoc tap at first
    if (sessionHelper().roles.includes(Roles.KyLuat) || sessionHelper().roles.includes(Roles.HocTap)) {
      const unionCode = lstUnion?.find(u => Number(u.unionId) === Number(sessionHelper().unionId))?.unionCode
      if (unionCode) setUnionFilter(unionCode)
    }

    // Set the default union appearing first for role phan doan truong
    if (sessionHelper().roles.includes(Roles.PhanDoanTruong)) {
      setUnionFilter(1)
      setUnionSelected(lstUnion[0].unionId)
    } else {
      setUnionSelected(sessionHelper().unionId)
    }
  }, [])


  const canShowListUnion = () => {
    return sessionHelper().roles.includes(Roles.PhanDoanTruong) || sessionHelper().roles.includes(Roles.KyLuat) || sessionHelper().roles.includes(Roles.HocTap)
  }

  const handleChange = (e) => {
    const value = e.target.value

    setUnionFilter(value)
    setUnionSelected(lstUnion.find(union => union.unionCode === value).unionId)
  }


  return (
    <Grid item container spacing={3} justifyContent='flex-start' alignItems='center'>
      <Grid item xs={6} sm={2}>
        {canShowListUnion() && (
          <Card>
            <TextField
              variant='outlined'
              fullWidth
              select
              InputProps={{
                startAdornment: <InputAdornment position='start'>Chi đoàn:</InputAdornment>
              }}
              value={unionFilter}
              onChange={e => handleChange(e)}
              style={{ textAlign: 'center' }}>
              {lstUnion?.map((option, i) => {
                return (
                  <MenuItem key={`absent-union-${option.unionId}`} value={option.unionCode}
                  >
                    {option.unionCode}
                  </MenuItem>
                )
              })}
            </TextField>
          </Card>
        )}
      </Grid>
    </Grid>
  )
}
