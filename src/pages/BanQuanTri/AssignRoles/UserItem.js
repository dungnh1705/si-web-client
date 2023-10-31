import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Avatar } from '@material-ui/core'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { UserStatus } from 'app/enums'
import { storageState } from 'recoils/firebase'

import { getLevel, getMaxRole } from 'utils/sessionHelper'
import FileUtils from 'utils/FileUtils'

import { EditingUser, UserFormMode } from 'pages/BanQuanTri/AssignRoles/recoil'
import moment from 'moment/moment'

import UserAction from './components/UserAction'
import { ChangeUserPasswordDialogAtom, ChangeUserStatusDialogAtom, UserInfoDialogAtom } from 'components/Dialog/recoil'
import { TextField, InputAdornment, Divider, Fab, List, Card, Button, makeStyles } from '@material-ui/core'

const useStyle = makeStyles({
  pinCell: {
    position: 'sticky',
    left: 0,
    zIndex: 1,
    backgroundColor: 'white',

    '&::after': {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '2px',
      zIndex: 2,
      content: '""',
      backgroundColor: '#dbdcef'
    }
  },
  pinCellSecond: {
    position: 'sticky',
    left: '68px',
    zIndex: 1,
    backgroundColor: 'white',

    '&::after': {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '2px',
      zIndex: 2,
      content: '""',
      backgroundColor: '#dbdcef'
    }
  }
})
const UserItem = ({ user }) => {
  const storage = useRecoilValue(storageState)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const setUserFormMode = useSetRecoilState(UserFormMode)
  const setEditingUser = useSetRecoilState(EditingUser)

  const [changePasswordDialog, setChangePasswordDialog] = useRecoilState(ChangeUserPasswordDialogAtom)
  const [changeStatusDialog, setChangeStatusDialog] = useRecoilState(ChangeUserStatusDialogAtom)
  const [changeInfoDialog, setChangeInfoDialog] = useRecoilState(UserInfoDialogAtom)

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

  const handleChangeInfo = () => {
    setChangeInfoDialog({ ...changeInfoDialog, open: true, info: user })
  }
  const styleClass = useStyle()
  return (
    <tr>
      {!isMobile && <td className={styleClass.pinCell}>#{user.id}</td>}

      <td className={isMobile ? styleClass.pinCell : styleClass.pinCellSecond}>
        <div className="d-flex align-items-center">
          {!isMobile && <Avatar alt="..." className="mr-2" src={imageUrl} />}

          <div>
            {user.holyName.name} {isMobile && <br />}
            {user.firstName}&nbsp;
            {user.lastName}
          </div>
        </div>
        {!isMobile && <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{user.email}</div>}
      </td>
      <td>{user.dob ? moment(user.dob).format('DD/MM/YYYY') : ''}</td>
      <td className="text-center">{user.patronDate ? moment(user.patronDate).format('DD/MM') : ''}</td>
      <td className="text-center">{user.phone ? `0${user.phone}` : ''}</td>
      <td className="text-center">{getLevel(user.roles, false)}</td>
      <td className="text-center">{getMaxRole(user.roles, false) === 'Huynh trưởng' || getMaxRole(user.roles, false) === 'Dự trưởng' ? '' : getMaxRole(user.roles, false)}</td>
      <td className="text-center">{user.assignment.groupName}</td>
      <td className="text-center text-muted">
        {user?.status === UserStatus.Active && <span className="my-2 text-success font-size-md px-4 py-1 h-auto badge badge-neutral-success">Đang dạy</span>}
        {user?.status === UserStatus.Absent && <span className="my-2 text-danger font-size-md px-4 py-1 h-auto badge badge-neutral-danger">Đã nghỉ</span>}
        {user?.status === UserStatus.Deleted && <span className="my-2 text-dark font-size-md px-4 py-1 h-auto badge badge-neutral-dark">Đã xóa</span>}
        {user?.status === UserStatus.NewUser && <span className="my-2 text-info font-size-md px-4 py-1 h-auto badge badge-neutral-info">Tài khoản mới</span>}
      </td>
      <td className="text-center">
        <UserAction handleChangePassword={handleChangePassword} handleChangeStatus={handleChangeStatus} handleChangeInfo={handleChangeInfo} />
      </td>
    </tr>
  )
}
export default UserItem
