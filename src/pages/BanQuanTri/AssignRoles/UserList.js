import React, { Fragment, Suspense, useEffect, useState } from 'react'
// import clsx from 'clsx'
import { useRecoilValue, useRecoilState } from 'recoil'
import { TextField, InputAdornment, Divider, Fab, List, Card, Button } from '@material-ui/core'
// import PerfectScrollbar from 'react-perfect-scrollbar'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBars, faEllipsisH } from '@fortawesome/free-solid-svg-icons'

//import Icon
import SearchIcon from '@material-ui/icons/Search'

//import internal components
import UserItem from './UserItem'

//import recoil atoms/selectors/gql
import { UserListQuery, SearchKey } from './recoil'

const UserList = () => {
  // const [page, setPage] = useState(0)
  // const [rowsPerPage, setRowsPerPage] = useState(6)

  // const rowsPerPage = 6

  //global states
  const userList = useRecoilValue(UserListQuery)
  // return (
  //   <>
  //     <div className="d-flex d-lg-none p-0 order-0 justify-content-between align-items-center">
  //       <Fab onClick={toggleUserList} size="small" color="primary">
  //         <FontAwesomeIcon icon={faBars} />
  //       </Fab>
  //     </div>
  //
  //     <div
  //       style={{ paddingTop: '5px', zIndex: !isShowUserList ? 59 : 1175 }}
  //       className={clsx('app-inner-content-layout--sidebar bg-white app-inner-content-layout--sidebar__xl pos-r border-right', { 'layout-sidebar-open': isShowUserList })}>
  //       <div className="p-1">
  //         <TextField
  //           fullWidth
  //           margin="dense"
  //           variant="outlined"
  //           InputProps={{
  //             startAdornment: (
  //               <InputAdornment position="start">
  //                 <SearchIcon />
  //               </InputAdornment>
  //             )
  //           }}
  //           // autoFocus
  //           onChange={handleChangeText}
  //           onBlur={handleSearch}
  //           value={searchText}
  //           onKeyUp={handleKeyUp}
  //         />
  //       </div>
  //
  //       <Divider />
  //       {!userList && <>Không tồn tại Huynh trưởng nào...</>}
  //
  //       {userList && (
  //         <List>
  //           <div className="scroll-area-xl shadow-overflow">
  //             <PerfectScrollbar>
  //               {userList.map(row => (
  //                 <Suspense fallback={<>Loading....</>} key={rowsPerPage + row.id}>
  //                   <UserItem user={row} />
  //                 </Suspense>
  //               ))}
  //             </PerfectScrollbar>
  //           </div>
  //         </List>
  //       )}
  //     </div>
  //     <div
  //       onClick={toggleUserList}
  //       className={clsx('sidebar-inner-layout-overlay', {
  //         active: isShowUserList
  //       })}
  //     />
  //   </>
  // )

  return (
    <Fragment>
      <Card className="card-box mb-4">
        <div className="card-header py-3">
          <div className="card-header--title">
            <h4 className="font-size-lg mb-0 py-1 font-weight-bold">Danh sách Huynh trưởng / Dự trưởng</h4>
          </div>
          {/*<div className="card-header--actions">*/}
          {/*  <Button size="small" variant="outlined" color="secondary">*/}
          {/*    <span className="btn-wrapper--icon">*/}
          {/*      <FontAwesomeIcon icon={['fas', 'plus-circle']} className="text-success" />*/}
          {/*    </span>*/}
          {/*    <span className="btn-wrapper--label">Add ticket</span>*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>
        <div className="table-responsive">
          <table className="table table-hover text-nowrap mb-0">
            <thead>
              <tr>
                <th className="bg-white text-left">ID</th>
                <th className="bg-white">Tên Thánh, Họ và Tên</th>
                <th className="bg-white text-left">Email</th>
                <th className="bg-white text-left">Ngày sinh</th>
                <th className="bg-white text-center">Năm tham gia Giáo Lý</th>
                <th className="bg-white text-center">SĐT</th>
                <th className="bg-white text-center">Công tác tại</th>
                <th className="bg-white text-center">Tình trạng</th>
                <th className="bg-white text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList?.map((user, index) => (
                <UserItem user={user} index={index} key={user.id} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Fragment>
  )
}

export default UserList
