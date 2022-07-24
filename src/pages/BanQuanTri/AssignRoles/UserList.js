import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useRecoilValue, useRecoilState } from 'recoil'
import { TextField, InputAdornment, Divider, Fab, List } from '@material-ui/core'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

//import Icon
import SearchIcon from '@material-ui/icons/Search'

//import internal components
import UserItem from './UserItem'

//import recoil atoms/selectors/gql
import { UserListQuery, SearchKey } from './recoil'

const UserList = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(6)
  const [searchKey, setSearchKey] = useRecoilState(SearchKey)
  const [searchText, setSearchText] = useState('')
  const [isShowUserList, setIsShowUserList] = useState(false)

  const handleSearch = () => {
    setSearchKey(searchText)
  }

  const handleChangeText = event => {
    setSearchText(event.target.value)
  }

  const toggleUserList = () => {
    setIsShowUserList(!isShowUserList)
  }

  const handleKeyUp = e => {
    e.preventDefault()

    if (e.key === 'Enter' || e.keyCode === 13) {
      setSearchKey(searchText)
    }
  }

  useEffect(() => {
    if (searchKey) {
      setSearchText(searchKey)
    }
  }, [])

  //global states
  const userList = useRecoilValue(UserListQuery)

  return (
    <>
      <div className="d-flex d-lg-none p-0 order-0 justify-content-between align-items-center">
        <Fab onClick={toggleUserList} size="small" color="primary">
          <FontAwesomeIcon icon={faBars} />
        </Fab>
      </div>

      <div
        style={{ paddingTop: '5px', zIndex: !isShowUserList ? 59 : 1175 }}
        className={clsx('app-inner-content-layout--sidebar bg-white app-inner-content-layout--sidebar__xl pos-r border-right', { 'layout-sidebar-open': isShowUserList })}>
        <div className="p-1">
          <TextField
            fullWidth
            margin="dense"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            // autoFocus
            onChange={handleChangeText}
            onBlur={handleSearch}
            value={searchText}
            onKeyUp={handleKeyUp}
          />
        </div>

        <Divider />
        {!userList && <>Không tồn tại Huynh trưởng nào...</>}

        {userList && (
          <List>
            <div className="scroll-area-xl shadow-overflow">
              <PerfectScrollbar>
                {userList?.map(row => {
                  return <UserItem user={row} key={rowsPerPage + row.id} />
                })}
              </PerfectScrollbar>
            </div>
          </List>
        )}
      </div>
      <div
        onClick={toggleUserList}
        className={clsx('sidebar-inner-layout-overlay', {
          active: isShowUserList
        })}
      />
    </>
  )
}

export default UserList
