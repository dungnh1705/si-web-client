import React, { Fragment } from 'react'

import { useRecoilValue } from 'recoil'
import { Card, makeStyles } from '@material-ui/core'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import UserItem from './UserItem'

import { UserListQuery } from './recoil'

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
  },
  colors: {
    backgroundColor: '#dbdcef',
    textAlign: 'center'
  },

  pinHeader: {
    position: 'sticky',
    top: 0,
    zIndex: 999
  }
})

const UserList = () => {
  const userList = useRecoilValue(UserListQuery)

  const styleClass = useStyle()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Fragment>
      <Card className="card-box mb-4">
        <div className="card-header py-3">
          <div className="card-header--title">
            <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Danh sách Huynh trưởng | Dự trưởng</h4>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover text-nowrap mb-0">
            <thead className={styleClass.pinHeader}>
              <tr>
                {!isMobile && <th className={styleClass.pinCell}>ID</th>}
                <th className={isMobile ? styleClass.pinCell : styleClass.pinCellSecond}>Tên Thánh, Họ và Tên</th>
                <th className={styleClass.colors}>Ngày sinh</th>
                <th className={styleClass.colors}>Ngày bổn mạng</th>
                <th className={styleClass.colors}>SĐT</th>
                <th className={styleClass.colors}>Cấp bậc</th>
                <th className={styleClass.colors}>Chức vụ</th>
                <th className={styleClass.colors}>Công tác tại</th>
                <th className={styleClass.colors}>Tình trạng</th>
                <th className={styleClass.colors}>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {userList?.map(user => (
                <UserItem user={user} key={user.id} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Fragment>
  )
}

export default UserList
