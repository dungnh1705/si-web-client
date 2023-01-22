import React from 'react'
import { useSetRecoilState } from 'recoil'
import { Avatar, ListItem, Grid } from '@material-ui/core'

import { EditingUser, UserFormMode } from './recoil'
import { getMaxRole } from 'utils/sessionHelper'
import Badge from 'components/UI/Badge'
import { UserStatus } from 'app/enums'

const UserItem = ({ user }) => {
  const setUserFormMode = useSetRecoilState(UserFormMode)
  const setEditingUser = useSetRecoilState(EditingUser)

  const handleClickEdit = () => {
    setEditingUser(user)
    setUserFormMode('Edit')
  }

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
            child={<Avatar sizes="50" src={user?.avatarUrl}>{`${user?.firstName?.substring(0, 1)}${user?.lastName?.substring(0, 1)}`}</Avatar>}
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
