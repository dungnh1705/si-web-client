import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Avatar } from '@material-ui/core'

// import Badge from 'components/UI/Badge'

import { UserStatus } from 'app/enums'
import { storageState } from 'recoils/firebase'

import { getLevel, getMaxRole } from 'utils/sessionHelper'
import FileUtils from 'utils/FileUtils'

import { EditingUser, UserFormMode } from 'pages/BanQuanTri/AssignRoles/recoil'
import moment from 'moment/moment'

import UserAction from './components/UserAction'
import { ChangeUserPasswordDialogAtom, ChangeUserStatusDialogAtom } from 'components/Dialog/recoil'

const UserItem = ({ user }) => {
  const storage = useRecoilValue(storageState)

  const setUserFormMode = useSetRecoilState(UserFormMode)
  const setEditingUser = useSetRecoilState(EditingUser)

  const [changePasswordDialog, setChangePasswordDialog] = useRecoilState(ChangeUserPasswordDialogAtom)
  const [changeStatusDialog, setChangeStatusDialog] = useRecoilState(ChangeUserStatusDialogAtom)

  const [imageUrl, setImageUrl] = useState()

  const handleClickEdit = () => {
    setEditingUser(user)
    setUserFormMode('Edit')
  }

  useEffect(() => {
    async function fetch() {
      const avatarFiles = await FileUtils.getFiles(storage, `avatars/${user.id}`)
      const userAvatar = avatarFiles.find(img => img.fileName === `${user.croppedAvatarId}.png`)

      setImageUrl(userAvatar?.url ?? null)
    }

    if (user.croppedAvatarId) fetch()
  }, [user])

  const handleChangePassword = () => {
    setChangePasswordDialog({ ...changePasswordDialog, open: true, info: user })
  }

  const handleChangeStatus = () => {
    setChangeStatusDialog({ ...changeStatusDialog, open: true, info: user })
  }

  return (
    <tr>
      <td className="font-weight-bold">#{user.id}</td>
      <td>
        <div className="d-flex align-items-center">
          <Avatar alt="..." className="mr-2" src={imageUrl} />
          <div>{user.fullName}</div>
        </div>
      </td>
      <td>{user.dob ? moment(user.dob).format('DD/MM/YYYY') : ''}</td>
      <td className="text-center">{user.joinedYear ? moment(user.joinedYear).format('YYYY') : ''}</td>
      <td className="text-center">{user.phone ? `0${user.phone}` : ''}</td>
      <td className="text-center">{getLevel(user.roles)}</td>
      <td className="text-center">{getMaxRole(user.roles) === 'Huynh trưởng' || getMaxRole(user.roles) === 'Dự trưởng' ? '' : getMaxRole(user.roles)}</td>
      <td className="text-center">{user.assignment.groupName}</td>
      <td className="text-center text-muted">
        {user?.status === UserStatus.Active && <span className="my-2 text-success font-size-md px-4 py-1 h-auto badge badge-neutral-success">Đang dạy</span>}
        {user?.status === UserStatus.Absent && <span className="my-2 text-danger font-size-md px-4 py-1 h-auto badge badge-neutral-danger">Đã nghỉ</span>}
        {user?.status === UserStatus.Deleted && <span className="my-2 text-dark font-size-md px-4 py-1 h-auto badge badge-neutral-dark">Đã xóa</span>}
        {user?.status === UserStatus.NewUser && <span className="my-2 text-info font-size-md px-4 py-1 h-auto badge badge-neutral-info">Tài khoản mới</span>}
      </td>
      <td className="text-center">
        <UserAction handleChangePassword={handleChangePassword} handleChangeStatus={handleChangeStatus} />
      </td>
    </tr>
  )
}

export default UserItem
