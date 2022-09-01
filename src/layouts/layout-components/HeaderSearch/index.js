import React, { useRef, useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { Grid, Fab, Container, InputAdornment, Drawer, IconButton, TextField, Divider, Typography, List, ListItem, Button, Hidden } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import moment from 'moment'

import SearchIcon from '@material-ui/icons/Search'
// import CallMadeIcon from '@material-ui/icons/CallMade'
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone'

import KeyboardEventHandler from 'react-keyboard-event-handler'

import { history } from 'App'
import { themeOptionsState } from 'recoils/atoms'
import { doGet } from 'utils/axios'
import { StudentStatus } from 'app/enums'

const useStyles = makeStyles(theme => ({
  active: {
    backgroundColor: '#d3d3d33b'
  }
}))

const useKeyPress = targetKey => {
  const [keyPressed, setKeyPressed] = useState(false)

  const downHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(true)
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  })
  return keyPressed
}

const HeaderSearch = () => {
  const classes = useStyles()
  const { layoutStyle } = useRecoilValue(themeOptionsState)
  const searchRef = useRef(null)

  const [dummySearchesStudents, setDummySearchesStudents] = useState([])
  const [dummySearchResult, setDummySearchResult] = useState([])
  const [searching, setSearching] = useState(0)
  const [cursor, setCursor] = useState(0)
  const [hovered, setHovered] = useState(undefined)

  const downPress = useKeyPress('ArrowDown')
  const upPress = useKeyPress('ArrowUp')
  const enterPress = useKeyPress('Enter')

  // const setRefNumber = useSetRecoilState(ReferenceNumber)
  // const [reloadQuote, setReloadQuote] = useRecoilState(ReloadQuote)

  const handleSearchChange = event => {
    setSearchValue(event.target.value)
    setSearching(old => old + 1)

    if (event.target.value) {
      if (!openSearchResults) {
        setOpenSearchResults(true)
      }
    } else {
      setOpenSearchResults(false)
      setSearching(0)
    }
  }

  const [openSearchResults, setOpenSearchResults] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [state, setState] = useState(false)

  const searchStudents = async value => {
    doGet('student/quickSearch', { keyword: value })
      .then(res => {
        if (res && res.data.success) {
          setDummySearchesStudents(res.data.data)
        }
      })
      .catch(err => console.log(err))
  }

  const handleRowClick = (e, val) => {
    // setRefNumber(val)
    e.preventDefault()

    history.push(`/FindStudent/${val}`)
    setState(false)
  }

  useEffect(() => {
    if (dummySearchResult.length && downPress) {
      setCursor(prevState => (prevState < dummySearchResult.length - 1 ? prevState + 1 : prevState))
    }
  }, [downPress])

  useEffect(() => {
    if (dummySearchResult.length && upPress) {
      setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState))
    }
  }, [upPress])

  useEffect(() => {
    if (dummySearchResult.length && hovered) {
      setCursor(dummySearchResult.indexOf(hovered))
    }
  }, [hovered])

  useEffect(() => {
    if (dummySearchResult.length && enterPress && state) {
      const val = dummySearchResult[cursor].id
      // setRefNumber(val)
      history.push(`/FindStudent/${val}`)

      setState(false)
    }
  }, [cursor, enterPress])

  // useEffect(() => {
  //   if (dummySearchResult.length) {
  //     setSearchValue(dummySearchResult[cursor].stuCode)
  //   }
  // }, [upPress, downPress, hovered])

  useEffect(() => {
    if (searching > 0) {
      searchStudents(searchValue)
    }
  }, [searching])

  useEffect(() => {
    setCursor(0)
    setDummySearchResult([...dummySearchesStudents])
  }, [dummySearchesStudents])

  return (
    <>
      {layoutStyle === 2 && (
        <IconButton size="medium" onClick={() => setState(true)} color="inherit" className="btn-inverse font-size-xs" style={{ marginLeft: '84px' }}>
          <SearchIcon />
        </IconButton>
      )}

      {layoutStyle === 1 && (
        <>
          <Hidden mdUp>
            <IconButton size="medium" onClick={() => setState(true)} color="inherit" className="btn-inverse font-size-xs">
              <SearchIcon />
            </IconButton>
          </Hidden>
          <Hidden smDown>
            <Button
              variant="outlined"
              size="medium"
              color="inherit"
              className="btn-inverse font-size-xs"
              startIcon={<SearchIcon size="medium" />}
              endIcon={<span className="header-search">ctrl+k</span>}
              onClick={() => setState(true)}>
              Tìm kiếm...
            </Button>
          </Hidden>
        </>
      )}

      <Drawer anchor="top" open={state} onClose={e => setState(false)}>
        <div className="app-search-wrapper" ref={searchRef}>
          <Container maxWidth="lg">
            <table style={{ width: '100%' }}>
              <tr>
                <td>
                  <TextField
                    className="app-search-input"
                    fullWidth
                    value={searchValue}
                    onChange={handleSearchChange}
                    inputProps={{ 'aria-label': 'search' }}
                    label="Tìm kiếm Đoàn sinh"
                    placeholder="Nhập thông tin Đoàn sinh..."
                    variant="outlined"
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon className="app-search-icon" />
                        </InputAdornment>
                      )
                    }}
                  />
                </td>
                <td style={{ width: '50px', paddingLeft: '10px' }}>
                  <Fab onClick={e => setState(false)} size="small" color="primary">
                    <CloseTwoToneIcon />
                  </Fab>
                </td>
              </tr>
            </table>
          </Container>
        </div>
        {/* <div className="d-flex align-items-center justify-content-center">
          <Fab onClick={e => setState(false)} size="small" color="primary">
            <CloseTwoToneIcon />
          </Fab>
        </div> */}
        <Container maxWidth="lg" className="pb-3">
          <div
            className={clsx('no-search-results', {
              'search-results-hidden': openSearchResults
            })}>
            <div>
              <div className="font-weight-bold font-size-xl">
                <Typography variant="h2" color="primary">
                  Chưa có kết quả tìm kiếm
                </Typography>
              </div>
            </div>
          </div>
          <div
            className={clsx('search-results', {
              'search-results-hidden': !openSearchResults
            })}>
            <div className="text-black py-4">
              <h3 className="font-size-xl mb-2 font-weight-bold">Kết quả</h3>
              <Divider />
            </div>
            {dummySearchResult.length === 0 && (
              <div>
                <div className="font-weight-bold font-size-xl">
                  <Typography variant="h4" color="primary">
                    Không tìm thấy Đoàn sinh phù hợp
                  </Typography>
                </div>
              </div>
            )}
            <Grid container item spacing={1} xs={12}>
              <List className="w-100">
                {dummySearchResult.length > 0 && (
                  <Grid container spacing={2} justifyContent="center" alignContent="center" alignItems="center">
                    <Grid item xs={6}>
                      <b>
                        Tên Thánh,
                        <Hidden mdUp>
                          <br />
                        </Hidden>
                        <Hidden smDown> </Hidden>
                        Họ và Tên
                        <br />
                        Ngày sinh
                      </b>
                    </Grid>
                    <Grid item xs={2}>
                      <b>Phân đoàn </b>
                    </Grid>
                    <Grid item xs={2} style={{ textAlign: 'center' }}>
                      <b>Chi đoàn </b>
                    </Grid>
                    <Grid item xs={2}>
                      <b>Tình trạng </b>
                    </Grid>
                  </Grid>
                )}
                <br />
                {dummySearchResult.map((item, i) => (
                  <div className={`${i === cursor ? classes.active : ''}`} key={item.stuCode}>
                    <ListItem button className="padding__remove">
                      <Grid
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        container
                        spacing={1}
                        onClick={e => handleRowClick(e, item.id)}
                        onMouseEnter={() => setHovered(item)}
                        onMouseLeave={() => setHovered(undefined)}>
                        <Grid item xs={6}>
                          {item.stuHolyname}
                          <Hidden mdUp>
                            <br />
                          </Hidden>
                          <Hidden smDown> </Hidden>
                          {item.stuFirstName} {item.stuLastName}
                          <br />
                          {item.stuDob ? moment(item.stuDob).format('DD-MM-YYYY') : 'Chưa nhập'}
                        </Grid>
                        <Grid item xs={3}>
                          {item.groupName}
                        </Grid>
                        <Grid item xs={1}>
                          {item.unionCode}
                        </Grid>
                        <Grid item xs={2}>
                          <span className="pl-2">
                            {item.status === StudentStatus.ChangeChurch && <span className="badge badge-danger">Chuyển xứ</span>}
                            {item.status === StudentStatus.LeaveStudy && <span className="badge badge-warning">Nghỉ luôn</span>}
                            {item.status === StudentStatus.Active && <span className="badge badge-success">Đang học</span>}
                            {item.status === StudentStatus.Deleted && <span className="badge badge-dark">Đã xóa</span>}
                            {item.status === StudentStatus.InActive && <span className="badge badge-dark">Chưa học</span>}
                          </span>
                        </Grid>
                      </Grid>
                      {/* <Grid container spacing={1} xs={1} item>
                        <a href={`/Quote/${item.ReferenceNumber}`} target="_blank">
                          <CallMadeIcon color="primary" />
                        </a>
                      </Grid> */}
                    </ListItem>
                  </div>
                ))}
              </List>
            </Grid>
          </div>
        </Container>
      </Drawer>
      <KeyboardEventHandler
        handleFocusableElements={true}
        handleKeys={['ctrl+k']}
        onKeyEvent={(key, e) => {
          e.preventDefault()
          setState(!state)
        }}
      />
    </>
  )
}

export default HeaderSearch
