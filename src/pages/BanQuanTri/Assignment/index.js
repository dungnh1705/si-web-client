import React, { useState, useEffect, Suspense } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import _ from 'lodash'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import GroupList from './GroupList'
import sessionHelper from 'utils/sessionHelper'

import { doPost } from 'utils/axios'
import UserList from './UserList'
import { toastState, loadingState } from 'recoils/atoms'
import { BranchQuery, HolyNameQuery } from 'recoils/selectors'
import { ClassQueryForAssign, UserQueryForAssign, ReloadListAssign, SelectedBranch } from './recoil'
import { Card, TextField, MenuItem, CardHeader } from '@material-ui/core'
import { RolesDialog } from 'components/Dialog'
import { RolesDialogAtom } from 'components/Dialog/recoil'

const Assignment = () => {
  let lstClass = useRecoilValue(ClassQueryForAssign)
  let lstUser = useRecoilValue(UserQueryForAssign)
  const lstBranch = useRecoilValue(BranchQuery)
  const [branch, setBranch] = useRecoilState(SelectedBranch)

  const setReload = useSetRecoilState(ReloadListAssign)
  const [assignList, setAssignList] = useState([])
  const [backupList, setBackupList] = useState([])
  const setLoading = useSetRecoilState(loadingState)
  const [toast, setToast] = useRecoilState(toastState)

  let lstHolyName = useRecoilValue(HolyNameQuery)
  let [rolesDialog, setRolesDialog] = useRecoilState(RolesDialogAtom)

  useEffect(() => {
    assignList.push({
      classId: 'NON',
      branchId: 'NON',
      groupName: 'Danh sách',
      users: lstUser.map(i => {
        return i
      })
    })

    lstClass.forEach(cl => {
      assignList.push({
        ...cl.group,
        classId: cl.id,
        leader: cl.leader,
        users: _.orderBy(
          cl.assignment.map(a => {
            return a.user
          }),
          ['lastName'],
          ['asc']
        )
      })
    })
    setBackupList(assignList)
    setAssignList(assignList.filter(ass => ass.branchId === branch || ass.branchId === 'NON'))
  }, [])

  const handleDragEnd = event => {
    const { source, destination } = event

    if (!destination) {
      return
    }

    const newLists = _.clone(assignList)
    const sourceList = newLists.find(cl => cl.classId === source.droppableId)
    const destinationList = newLists.find(cl => cl.classId === destination.droppableId)

    let [removedItem] = sourceList.users.splice(source.index, 1)

    if (source.droppableId === destination.droppableId) {
      sourceList.users.splice(destination.index, 0, removedItem)
      setAssignList(newLists)
    } else {
      const classId = destination.droppableId
      const previous = source.droppableId

      if (removedItem.assignment == null) {
        removedItem = {
          ...removedItem,
          assignment: {
            previousClassId: previous,
            classId: classId,
            appUserId: removedItem.id,
            modifiedBy: `${sessionHelper().firstName} ${sessionHelper().lastName}`,
            createdBy: `${sessionHelper().firstName} ${sessionHelper().lastName}`,
            isActive: true
          }
        }
      } else {
        removedItem.assignment.previousClassId = previous
        removedItem.assignment.classId = classId
        removedItem.assignment.modifiedBy = `${sessionHelper().firstName} ${sessionHelper().lastName}`
        removedItem.assignment.isActive = classId === 'NON' ? false : true
      }
      destinationList.users.splice(destination.index, 0, removedItem)
      setAssignList(newLists)
      updateUserAssignment(removedItem)
    }
  }

  const updateUserAssignment = async userInfo => {
    setLoading(true)

    try {
      var res = await doPost(`user/updateAssignment`, userInfo)

      if (res && res.data.success) {
        setLoading(false)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
        setReload(reload => reload + 1)
      }
    } catch (err) {
      setLoading(false)
      setToast({ ...toast, open: true, message: err.message, type: 'error' })
    }
  }

  const handleUserOpen = user => {
    setRolesDialog({ ...rolesDialog, open: true, pageCall: 'BQT-Assignment', user: user })
  }

  const handleChangeBranch = e => {
    e.preventDefault()

    const val = e.target.value
    setBranch(val)

    setAssignList(backupList.filter(ass => ass.branchId === val || ass.branchId === 'NON'))
  }

  const LeaderForm = leader => {
    const lead = leader.leader
    const holyName = lstHolyName.find(h => h.id === lead?.holyNameId)?.name

    return lead ? (
      <Card style={{ marginBottom: '8px' }}>
        <CardHeader
          style={{ padding: '5px 12px' }}
          subheader="# Phân Đoàn trưởng"
          subheaderTypographyProps={{ variant: 'subtitle2' }}
          title={`${holyName} ${lead.firstName} ${lead.lastName}`}
          titleTypographyProps={{ variant: 'subtitle2', gutterBottom: true }}
        />
      </Card>
    ) : null
  }

  return (
    <Suspense fallback={<>Đang tải danh sách công tác...</>}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flexGrow: 1, overflowX: 'auto', overflowY: 'auto', whiteSpace: 'nowrap' }}>
          <TextField variant="outlined" style={{ width: '150px', backgroundColor: 'white' }} select value={branch} onChange={handleChangeBranch}>
            {lstBranch
              ?.filter(b => b.branchId !== 'NON')
              .map((option, i) => {
                return (
                  <MenuItem key={`branch-${i * 11}`} value={option.branchId}>
                    {option.branchName}
                  </MenuItem>
                )
              })}
          </TextField>

          <DragDropContext onDragEnd={handleDragEnd}>
            {assignList?.map(cl => (
              <Droppable droppableId={cl.classId} key={`class-${cl.classId}`}>
                {(provided, snapshot) => (
                  <GroupList provided={provided} snapshot={snapshot} title={cl.groupName} total={cl.classId === 'NON' ? cl.users.length : cl.users.length + 1}>
                    <LeaderForm leader={cl.leader} />
                    {cl.users.map((user, index) => (
                      <Draggable draggableId={user.id} index={index} key={`ass-${user.id}`}>
                        {(provided, snapshot) => <UserList onOpen={() => handleUserOpen(user)} provided={provided} snapshot={snapshot} user={user} />}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </GroupList>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
      </div>

      <RolesDialog />
    </Suspense>
  )
}

export default Assignment
