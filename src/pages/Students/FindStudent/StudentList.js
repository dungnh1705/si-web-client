import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Fab, TextField, InputAdornment, List, Divider } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import PerfectScrollbar from 'react-perfect-scrollbar'
import clsx from 'clsx'

import StudentItem from './StudentItem'
import { SearchKeyword, StudentSearchList, ShowStudent } from './recoil'

const StudentList = () => {
  const [isShowStudentList, setIsShowStudentList] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchKey, setSearchKey] = useRecoilState(SearchKeyword)
  let lstStudent = useRecoilValue(StudentSearchList)
  let setShowStudent = useSetRecoilState(ShowStudent)

  const toggleStudentList = () => {
    setIsShowStudentList(!isShowStudentList)
  }

  const handleChangeSearchKey = e => {
    e.preventDefault()
    setSearchText(e.target.value)
  }
  const handleSearchStudent = () => {
    setShowStudent(undefined)
    setSearchKey(searchText)
  }

  const handleKeyUp = e => {
    e.preventDefault()

    if (e.key === 'Enter' || e.keyCode === 13) {
      setShowStudent(undefined)
      setSearchKey(searchText)
    }
  }

  useEffect(() => {
    if (searchKey) {
      setSearchText(searchKey)
    }
  }, [])

  return (
    <>
      <div className="d-flex d-lg-none p-0 order-0 justify-content-between align-items-center">
        <Fab onClick={toggleStudentList} size="small" color="primary">
          <FontAwesomeIcon icon={faSearch} />
        </Fab>
      </div>
      <div
        style={{ paddingTop: '5px', zIndex: !isShowStudentList ? 1 : 1175 }}
        className={clsx('app-inner-content-layout--sidebar bg-white app-inner-content-layout--sidebar__xl pos-r border-right', { 'layout-sidebar-open': isShowStudentList })}>
        <div className="p-1">
          <TextField
            fullWidth
            margin="dense"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faSearch} />
                </InputAdornment>
              )
            }}
            placeholder="Nhập thông tin Đoàn sinh"
            onChange={handleChangeSearchKey}
            onBlur={handleSearchStudent}
            value={searchText}
            onKeyUp={handleKeyUp}
          />
        </div>
        <Divider />

        {lstStudent && (
          <List>
            <div className="scroll-area-xl shadow-overflow" style={{ height: '100vh' }}>
              <PerfectScrollbar>
                {lstStudent?.map(row => (
                  <StudentItem student={row} key={`fStu-${row.id}`} action={toggleStudentList} />
                ))}
              </PerfectScrollbar>
            </div>
          </List>
        )}
      </div>
      <div
        onClick={toggleStudentList}
        className={clsx('sidebar-inner-layout-overlay', {
          active: isShowStudentList
        })}
      />
    </>
  )
}

export default StudentList
