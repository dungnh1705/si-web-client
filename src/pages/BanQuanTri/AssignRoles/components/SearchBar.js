import React, { Fragment, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { SearchKey } from '../recoil'
import { Grid, InputAdornment, TextField } from '@material-ui/core'

import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'

export default function SearchBar() {
  const [searchText, setSearchText] = useState('')
  const [searchKey, setSearchKey] = useRecoilState(SearchKey)

  // const handleSearch = () => {
  //   setSearchKey(searchText)
  // }

  const handleChangeText = event => {
    setSearchText(event.target.value)
  }

  const handleClearSearch = e => {
    setSearchText('')
    if (searchKey) setSearchKey('')
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

  return (
    <Fragment>
      <Grid item xs={12} lg={4}>
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          placeholder={'Nhập thông tin ...'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchText ? (
              <InputAdornment position="end" onClick={handleClearSearch} className="header__active">
                <CloseIcon />
              </InputAdornment>
            ) : (
              <></>
            )
          }}
          autoFocus={true}
          onChange={handleChangeText}
          // onBlur={handleSearch}
          value={searchText}
          onKeyUp={handleKeyUp}
        />
      </Grid>
    </Fragment>
  )
}
