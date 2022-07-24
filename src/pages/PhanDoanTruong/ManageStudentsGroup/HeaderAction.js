import React, { useState, useRef, useEffect } from 'react'
import { TextField, Popper, Tooltip, Fab, Grow, Paper, ClickAwayListener } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSetRecoilState } from 'recoil'

import { SearchGroupStudent } from './recoil'
import { PageTitle } from 'layouts/layout-components'

export default function HeaderAction() {
  const [searchText, setSearchText] = useState()
  let setSearchKey = useSetRecoilState(SearchGroupStudent)
  let [openSearch, setOpenSearch] = useState(false)

  const anchorRef = useRef(null)
  const prevSearchOpen = useRef(openSearch)

  useEffect(() => {
    if (prevSearchOpen.current === true && openSearch === false) {
      anchorRef.current.focus()
    }
    prevSearchOpen.current = openSearch
  }, [openSearch])

  const handleChangeSearchKey = e => {
    setSearchText(e.target.value)
  }

  const handleBlur = () => {
    setOpenSearch(false)
    setSearchKey(searchText)
  }

  const handleKeyUp = e => {
    e.preventDefault()

    if (e.key === 'Enter' || e.keyCode === 13) {
      setOpenSearch(false)
      setSearchKey(searchText)
    }
  }

  const handleClickSearch = () => {
    setOpenSearch(prevOpen => !prevOpen)
  }

  return (
    <>
      {/* <Tooltip title="Tìm kiếm Đoàn sinh">
        <Fab component="div" size="small" color="primary" onClick={handleClickSearch} ref={anchorRef}>
          <FontAwesomeIcon icon={['fas', 'search']} />
        </Fab>
      </Tooltip>

      <Popper open={openSearch} anchorEl={anchorRef.current} role={undefined} transition placement="left">
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <ClickAwayListener onClickAway={handleBlur}>
              <TextField
                fullWidth
                margin="dense"
                variant="outlined"
                onChange={handleChangeSearchKey}
                onBlur={handleBlur}
                onKeyUp={handleKeyUp}
                value={searchText}
                placeholder="Nhập tên Đoàn sinh"
                style={{ backgroundColor: 'white' }}
              />
            </ClickAwayListener>
          </Grow>
        )}
      </Popper> */}
      <PageTitle titleHeading="Danh sách phân đoàn" titleDescription="" />
    </>
  )
}
