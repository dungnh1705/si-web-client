import React, { Fragment, Suspense, useState } from 'react'
import { Grid, Card, TextField, InputAdornment, MenuItem, Tooltip, Fab, Typography, Button } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'

// External
import { doPost } from 'utils/axios'
import sessionHelper, { setLocalStoreData } from 'utils/sessionHelper'

import ModalSkeleton from 'components/Loading/modal-skeleton'
import { RolesDialog } from 'components/Dialog'

import { UnionQuery } from 'recoils/selectors'
import { toastState, loadingState } from 'recoils/atoms'

// Internal
import UserList from './UserList'
import { UserInGroupQuery, AssignmentIdSelected, ReloadUserInGroup } from './recoil'

// icons
import AddTwoToneIcon from '@material-ui/icons/AddTwoTone'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const AssignUserUnion = () => {
  const lstAssignment = useRecoilValue(UserInGroupQuery)
  const lstUnion = useRecoilValue(UnionQuery)

  const [assignIds, setAssignIds] = useRecoilState(AssignmentIdSelected)
  const [toast, setToast] = useRecoilState(toastState)

  const setLoading = useSetRecoilState(loadingState)
  const setReloadUsers = useSetRecoilState(ReloadUserInGroup)

  const [union, setUnion] = useState('')

  let isAssignTeaching = false
  for (let assign of lstAssignment) {
    if (assign.assigns.find(a => a.appUserId == sessionHelper().userId)) {
      isAssignTeaching = true
      break
    }
  }

  const gridHaveNoUnion = [
    { xs: 12, md: 6, lg: 8 },
    { xs: 12, md: 12, lg: 6 }
  ]
  const gridHaveUnion = [{ xs: 12 }, { xs: 12, md: 6, lg: 4 }]
  const responGrid = lstAssignment ? (lstAssignment[0]?.unionId === 1 ? gridHaveNoUnion : gridHaveUnion) : []

  const handleDisabled = () => {
    return !(assignIds.length > 0 && union !== '')
  }

  const isLeaderAssign = () => {
    for (let assignId of assignIds) {
      const assignInfo = lstAssignment[0].assigns.find(a => a.id === assignId)
      if (assignInfo.appUserId == sessionHelper().userId) {
        return true
      }
    }
    return false
  }

  const handleClickSave = async e => {
    e.preventDefault()
    setLoading(true)

    const isReloadPage = isLeaderAssign()

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
        if (isReloadPage) {
          setLocalStoreData('unionId', union)
          window.location.reload()
        }
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const assignLeaderForTeaching = async e => {
    e.preventDefault()
    setLoading(true)

    const data = {
      ClassId: sessionHelper().classId,
      AppUserId: sessionHelper().userId
    }

    try {
      const res = await doPost(`user/assignLeaderForTeaching`, data)
      if (res && res.data.success) {
        setLoading(false)
        setReloadUsers(reload => reload + 1)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const body = () => {
    return (
      <Fragment>
        {lstAssignment && lstAssignment.length > 0 && (
          <>
            <Grid container spacing={2} justifyContent="flex-start" alignItems="center">
              <Grid item xs={3} md={2} lg={1}>
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

              <Grid item lg={7}>
                &nbsp;
              </Grid>

              <Grid item xs={5} lg={3}>
                <Button variant="contained" disabled={isAssignTeaching} onClick={assignLeaderForTeaching}>
                  {isAssignTeaching ? 'Đã tham gia dạy học' : 'Tham gia dạy học'}
                  {isAssignTeaching && (
                    <>
                      &nbsp;
                      <FontAwesomeIcon icon={faCheck} />
                    </>
                  )}
                </Button>
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
      </Fragment>
    )
  }

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
