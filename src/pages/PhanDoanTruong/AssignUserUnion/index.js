import React, { Suspense, useState } from 'react'
import { Grid, Card, TextField, InputAdornment, MenuItem, Tooltip, Fab, Typography } from '@material-ui/core'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'

// External
import { doPost } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'

import ModalSkeleton from 'components/Loading/modal-skeleton'
import { RolesDialog } from 'components/Dialog'

import { UnionQuery } from 'recoils/selectors'
import { toastState, loadingState } from 'recoils/atoms'

// Internal
import UserList from './UserList'
import { UserInGroupQuery, AssignmentIdSelected, ReloadUserInGroup } from './recoil'

// icons
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone'

const AssignUserUnion = () => {
  const lstAssignment = useRecoilValue(UserInGroupQuery)
  const lstUnion = useRecoilValue(UnionQuery)

  const [assignIds, setAssignIds] = useRecoilState(AssignmentIdSelected)
  const [toast, setToast] = useRecoilState(toastState)

  const setLoading = useSetRecoilState(loadingState)
  const setReloadUsers = useSetRecoilState(ReloadUserInGroup)

  const [union, setUnion] = useState('')

  const gridHaveNoUnion = [
    { xs: 12, md: 6, lg: 8 },
    { xs: 12, md: 12, lg: 6 }
  ]
  const gridHaveUnion = [{ xs: 12 }, { xs: 12, md: 6, lg: 4 }]
  const responGrid = lstAssignment ? (lstAssignment[0]?.unionId === 1 ? gridHaveNoUnion : gridHaveUnion) : []

  const handleDisabled = () => {
    return !(assignIds.length > 0 && union !== '')
  }

  const handleClickSave = async e => {
    e.preventDefault()
    setLoading(true)

    const newData = {
      UnionId: union,
      ModifiedBy: `${sessionHelper().firstName} ${sessionHelper().lastName}`,
      AssignmentId: assignIds
    }
    try {
      const res = await doPost(`assignment/updateUnion`, newData)
      if (res && res.data.success) {
        setLoading(false)
        setReloadUsers(reload => reload + 1)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setAssignIds([])
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const body = () => {
    return (
      <>
        {lstAssignment && lstAssignment.length > 0 && (
          <>
            <Grid container spacing={2} justifyContent="flex-start" alignItems="center">
              <Grid item xs={6} md={2} lg={1}>
                <Card>
                  <TextField
                    variant="outlined"
                    fullWidth
                    select
                    InputProps={{
                      startAdornment: <InputAdornment position="start">CĐ:</InputAdornment>
                    }}
                    value={union}
                    onChange={e => setUnion(e.target.value)}>
                    {lstUnion.map((option, i) => {
                      return (
                        <MenuItem key={`union-${i * 33}`} value={option.unionId}>
                          {option.unionCode}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </Card>
              </Grid>
              <Grid item xs={3} lg={1}>
                <Tooltip arrow title="Phân chi đoàn">
                  <Fab component="div" size="small" color="primary" disabled={handleDisabled()} onClick={handleClickSave}>
                    <AddTwoToneIcon />
                  </Fab>
                </Tooltip>
              </Grid>
            </Grid>
          </>
        )}

        {lstAssignment && lstAssignment.length === 0 && (
          <Grid container item spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4">Chưa có Huynh trưởng/Dự trưởng trong Phân đoàn.</Typography>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={2}>
          {lstAssignment && lstAssignment[0]?.unionId === 1 && (
            <Grid container item xs={12} md={6} lg={4} direction="row" spacing={1}>
              <Grid item xs={12}>
                <UserList item={lstAssignment[0]} />
              </Grid>
            </Grid>
          )}

          <Grid container item {...responGrid[0]} direction="row" spacing={1}>
            {lstAssignment &&
              lstAssignment?.map((item, index) => {
                if (item.unionId !== 1) {
                  return (
                    <Grid {...responGrid[1]} item key={`ass-u-${item.unionId + 1}-${index}`}>
                      <UserList item={item} />
                    </Grid>
                  )
                }
                return <></>
              })}
          </Grid>
        </Grid>
      </>
    )
  }

  // console.log(lstAssignment)

  return (
    <Suspense fallback={<>Đang tải Danh sách Huynh trưởng ...</>}>
      {body()}
      <Suspense fallback={<ModalSkeleton loading={true} />}>
        <RolesDialog />
      </Suspense>
    </Suspense>
  )
}

export default AssignUserUnion
