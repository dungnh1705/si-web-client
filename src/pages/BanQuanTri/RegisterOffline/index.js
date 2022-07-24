// Core
import React, { useState, Suspense, useEffect, useCallback } from 'react'
import { Grid, TextField, InputAdornment } from '@material-ui/core'
import { useRecoilState } from 'recoil'

// Icon
import SearchIcon from '@material-ui/icons/Search'

// External
import PageSkeleton from 'components/Loading/page-skeleton'

// Internal
import RegisterForm from './RegisterForm'
import StudentList from './StudentList'
import { NewStudentSearchKey } from './recoil'

const RegisterOffline = () => {
  const [searchKey, setSearchKey] = useRecoilState(NewStudentSearchKey)

  const SearchTextInput = ({ text }) => {
    const [searchText, setSearchText] = useState('')

    const handleKeyUp = e => {
      e.preventDefault()
      if (e.key === 'Enter' || e.keyCode === 13) {
        setSearchKey(searchText)
      }
    }

    const onChangeSearchText = useCallback(
      e => {
        setSearchText(e.target.value)
      },
      [searchText]
    )

    useEffect(() => {
      if (text) setSearchText(text)
    }, [])

    return (
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
        onChange={onChangeSearchText}
        onKeyUp={handleKeyUp}
        value={searchText}
        style={{ backgroundColor: 'white' }}
        placeholder="Nhập tên Đoàn sinh"
      />
    )
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <RegisterForm />
      </Grid>

      <Grid item xs={12}>
        <SearchTextInput text={searchKey} />
        <Suspense fallback={<PageSkeleton />}>
          <StudentList />
        </Suspense>
      </Grid>
    </Grid>
  )
}

export default RegisterOffline
