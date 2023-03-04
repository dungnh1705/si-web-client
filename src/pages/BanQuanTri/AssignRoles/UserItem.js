import React, { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Avatar, ListItem, Grid } from '@material-ui/core'

import Badge from 'components/UI/Badge'

import { UserStatus } from 'app/enums'
import { storageState } from 'recoils/firebase'

import { getMaxRole } from 'utils/sessionHelper'
import FileUtils from 'utils/FileUtils'

import { EditingUser, UserFormMode } from 'pages/BanQuanTri/AssignRoles/recoil'

const UserItem = ({ user }) => {
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
    <ListItem button className="align-box-row" onClick={() => handleClickEdit(user)} key={user?.id}>
      <Grid container spacing={3} item xs={12}>
        <div className="d-flex align-items-center pl-2">
          <Badge
            isActive={user?.status === UserStatus.Active}
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            variant="dot"
            child={<Avatar sizes="50" src={imageUrl}>{`${user?.firstName?.substring(0, 1)}${user?.lastName?.substring(0, 1)}`}</Avatar>}
          />
          <div className="p-3">
            <a href="#/" onClick={e => e.preventDefault()} className="font-weight-bold text-black" title="...">
              {`${user?.holyName?.name ?? ''} ${user.firstName ?? ''} ${user.lastName ?? ''}`}
            </a>
            <span className="d-block"># {getMaxRole(user?.roles)}</span>
            <span className="text-black-50 d-block">{user.email}</span>
          </div>
        </div>
      </Grid>
    </ListItem>
  )
}

export default UserItem
