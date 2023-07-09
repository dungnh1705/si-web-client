import React, { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Avatar, ListItem, Grid, Button } from '@material-ui/core'

// import Badge from 'components/UI/Badge'

import { UserStatus } from 'app/enums'
import { storageState } from 'recoils/firebase'

// import { getMaxRole } from 'utils/sessionHelper'
import FileUtils from 'utils/FileUtils'

import { EditingUser, UserFormMode } from 'pages/BanQuanTri/AssignRoles/recoil'
import moment from 'moment/moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

const UserItem = ({ user, index }) => {
  const storage = useRecoilValue(storageState)

  const setUserFormMode = useSetRecoilState(UserFormMode)
  const setEditingUser = useSetRecoilState(EditingUser)

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

  return (
    // <ListItem button className="align-box-row" onClick={() => handleClickEdit(user)} key={user?.id}>
    //   <Grid container spacing={3} item xs={12}>
    //     <div className="d-flex align-items-center pl-2">
    //       <Badge
    //         isActive={user?.status === UserStatus.Active}
    //         overlap="circular"
    //         anchorOrigin={{
    //           vertical: 'bottom',
    //           horizontal: 'right'
    //         }}
    //         variant="dot"
    //         child={<Avatar sizes="50" src={imageUrl}>{`${user?.firstName?.substring(0, 1)}${user?.lastName?.substring(0, 1)}`}</Avatar>}
    //       />
    //       <div className="p-3">
    //         <a href="#/" onClick={e => e.preventDefault()} className="font-weight-bold text-black" title="...">
    //           {`${user?.holyName?.name ?? ''} ${user.firstName ?? ''} ${user.lastName ?? ''}`}
    //         </a>
    //         <span className="d-block"># {getMaxRole(user?.roles)}</span>
    //         <span className="text-black-50 d-block">{user.email}</span>
    //       </div>
    //     </div>
    //   </Grid>
    // </ListItem>
    <tr>
      <td className="font-weight-bold">#{index + 1}</td>
      <td>
        <div className="d-flex align-items-center">
          <Avatar alt="..." className="mr-2" src={imageUrl} />
          <div>{user.fullName}</div>
        </div>
      </td>
      <td>{user.email}</td>
      <td>{user.dob ? moment(user.dob).format('DD/MM/YYYY') : ''}</td>
      <td className="text-center">{user.joinedYear ? moment(user.joinedYear).format('YYYY') : ''}</td>
      <td className="text-center">{user.phone ? `0${user.phone}` : ''}</td>
      <td className="text-center">{user.assignment.groupName}</td>
      <td className="text-center text-muted">
        {user?.status === UserStatus.Active && <span className="my-2 text-success font-size-md px-4 py-1 h-auto badge badge-neutral-success">Đang dạy</span>}
        {user?.status === UserStatus.Absent && <span className="my-2 text-danger font-size-md px-4 py-1 h-auto badge badge-neutral-danger">Đã nghỉ</span>}
        {user?.status === UserStatus.Deleted && <span className="my-2 text-dark font-size-md px-4 py-1 h-auto badge badge-neutral-dark">Đã xóa</span>}
        {user?.status === UserStatus.NewUser && <span className="my-2 text-info font-size-md px-4 py-1 h-auto badge badge-neutral-info">Tài khoản mới</span>}
      </td>
      <td className="text-center">
        <Button size="small" color="primary">
          <FontAwesomeIcon icon={faEllipsisH} className="font-size-lg" />
        </Button>
      </td>
    </tr>
  )
}

export default UserItem
