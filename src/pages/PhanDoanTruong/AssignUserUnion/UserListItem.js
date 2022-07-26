import React from 'react'
import { Typography, Tooltip, IconButton } from '@material-ui/core'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import StyledCheckbox from 'components/UI/StyledCheckbox'

import red from '@material-ui/core/colors/red'
import ClearTwoToneIcon from '@material-ui/icons/ClearTwoTone'
import sessionHelper from 'utils/sessionHelper'
import config from 'config'
import { doPost } from 'utils/axios'

import { HolyNameQuery } from 'recoils/selectors'
import { ReloadUserInGroup, AssignmentIdSelected } from './recoil'
import { toastState, loadingState } from 'recoils/atoms'
import { RolesDialogAtom } from 'components/Dialog/recoil'

const UserListItem = ({ assign }) => {
  const lstHolyName = useRecoilValue(HolyNameQuery)
  const setLoading = useSetRecoilState(loadingState)
  const setReloadUsers = useSetRecoilState(ReloadUserInGroup)
  const [toast, setToast] = useRecoilState(toastState)
  const [assignIds, setAssignIds] = useRecoilState(AssignmentIdSelected)
  let [rolesDialog, setRolesDialog] = useRecoilState(RolesDialogAtom)

  const handleCheckUser = e => {
    const val = Number(e.target.value)
    const itemExist = assignIds.find(v => v === val)
    if (itemExist) {
      setAssignIds(assignIds.filter(i => i !== val))
    } else {
      setAssignIds([...assignIds, val])
    }
  }

  const handleRemoveUnion = async e => {
    e.preventDefault()
    setLoading(true)

    const newData = {
      UnionId: 1,
      ModifiedBy: `${sessionHelper().firstName} ${sessionHelper().lastName}`,
      AssignmentId: [assign.id]
    }
    try {
      const res = await doPost(`assignment/updateUnion`, newData)
      if (res && res.data.success) {
        setLoading(false)
        setReloadUsers(reload => reload + 1)
        setToast({ ...toast, open: true, message: res.data.message, type: 'success' })
      }
    } catch (err) {
      setToast({ ...toast, open: true, message: err.data.message, type: 'error' })
    }
  }

  const handleClickRow = () => {
    setRolesDialog({ ...rolesDialog, open: true, pageCall: 'PDT-AssignUnion', user: assign?.user })
  }

  return (
    <tr>
      {assign?.unionId === 1 && (
        <td>
          <StyledCheckbox onChange={handleCheckUser} value={assign?.id} />
        </td>
      )}
      <td style={{ cursor: 'pointer' }} onClick={handleClickRow}>
        <Typography>
          {lstHolyName.find(h => h.id === assign?.user.holyNameId)?.name} {assign?.user.firstName} {assign?.user.lastName}
        </Typography>
      </td>
      {assign?.unionId !== 1 && (
        <td>
          <Tooltip arrow title="Xóa chi đoàn">
            <IconButton style={{ color: red[400] }} size="medium" aria-label="upload picture" component="span" onClick={handleRemoveUnion}>
              <ClearTwoToneIcon />
            </IconButton>
          </Tooltip>
        </td>
      )}
    </tr>
  )
}

export default UserListItem
