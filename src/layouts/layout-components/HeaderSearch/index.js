import React, { Fragment, useRef, useState, useEffect } from 'react'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import { Grid, Fab, Container, InputAdornment, Drawer, IconButton, TextField, Divider, Typography, List, ListItem } from '@material-ui/core'
import clsx from 'clsx'
import SearchIcon from '@material-ui/icons/Search'
import CallMadeIcon from '@material-ui/icons/CallMade'
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone'
import Icon from '@material-ui/core/Icon'
import KeyboardEventHandler from 'react-keyboard-event-handler'
// import { createGqlClient } from 'utils/gqlUtil'
import config from 'config'
// import { QUOTES } from 'gql/query/Quote'
// import { CLIENTS } from 'gql/query/Client'
import { themeOptionsState } from 'recoils/atoms'
import { history } from 'App'

import { makeStyles } from '@material-ui/core/styles'
// import { MappingQuoteStatus } from '../../../pages/Admin/Quote/utils/QuoteStatusEnum'

// import { ReferenceNumber, ReloadQuote } from 'pages/Admin/Quote/recoil'

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
  const { sidebarToggle, layoutStyle } = useRecoilValue(themeOptionsState)
  const searchRef = useRef(null)

  const [dummySearchesQuotes, setDummySearchesQuotes] = useState([])
  const [dummySearchesClients, setDummySearchesClients] = useState([])

  const downPress = useKeyPress('ArrowDown')
  const upPress = useKeyPress('ArrowUp')
  const enterPress = useKeyPress('Enter')
  const [cursor, setCursor] = useState(0)
  const [hovered, setHovered] = useState(undefined)

  const [dummySearchResult, setDummySearchResult] = useState([])

  // const setRefNumber = useSetRecoilState(ReferenceNumber)
  // const [reloadQuote, setReloadQuote] = useRecoilState(ReloadQuote)
  const [searching, setSearching] = useState(0)

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

  const searchQuotes = value => {}

  const searchClients = value => {}
  const handleRowClick = (e, val) => {
    // setRefNumber(val)

    e.preventDefault()

    history.push(`/Quote/${val}`)
    setState(false)
  }

  const handleRowClientClick = (e, val) => {
    e.preventDefault()

    history.push(`${val}`)

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
      if (dummySearchResult[cursor].__typename === 'Quote') {
        let val = dummySearchResult[cursor].ReferenceNumber
        // setRefNumber(val)
        history.push(`/Quote/${val}`)
      } else {
        let code = dummySearchResult[cursor].Code
        let val = `/Client/${code}`
        history.push(`${val}`)
      }
      setState(false)
    }
  }, [cursor, enterPress])

  useEffect(() => {
    if (dummySearchResult.length) {
      if (dummySearchResult[cursor].__typename === 'Quote') {
        setSearchValue(dummySearchResult[cursor].ReferenceNumber)
      } else {
        setSearchValue(dummySearchResult[cursor].Name)
      }
    }
  }, [upPress, downPress, hovered])

  useEffect(() => {
    if (searching > 0) {
      searchQuotes(searchValue)
      searchClients(searchValue)
    }
  }, [searching])

  useEffect(() => {
    setCursor(0)
    setDummySearchResult([...dummySearchesQuotes, ...dummySearchesClients])
  }, [dummySearchesQuotes, dummySearchesClients])

  return (
    <>
      {layoutStyle === 2 && (
        <IconButton size="medium" onClick={() => setState(true)} color="inherit" className="btn-inverse font-size-xs" style={{ marginLeft: '84px' }}>
          <SearchIcon />
        </IconButton>
      )}

      {layoutStyle === 1 && (
        <IconButton size="medium" onClick={() => setState(true)} color="inherit" className="btn-inverse font-size-xs">
          <SearchIcon />
        </IconButton>
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
                    label="Search"
                    placeholder="Search Quote Number or Insured Name here..."
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
                  No search results
                </Typography>
              </div>
            </div>
          </div>
          <div
            className={clsx('search-results', {
              'search-results-hidden': !openSearchResults
            })}>
            <div className="text-black py-4">
              <h3 className="font-size-xl mb-2 font-weight-bold">Search results</h3>
              <Divider />
            </div>
            {dummySearchResult.length === 0 && (
              <div>
                <div className="font-weight-bold font-size-xl">
                  <Typography variant="h4" color="primary">
                    Not found any quote number/insured name
                  </Typography>
                </div>
              </div>
            )}
            <Grid container item spacing={1} xs={12}>
              <List className="w-100">
                {dummySearchResult.map(
                  (search, i) =>
                    search.__typename === 'Quote' && (
                      <div className={`${i === cursor ? classes.active : ''}`}>
                        <ListItem key={i} button>
                          <Grid
                            container
                            spacing={1}
                            onClick={e => handleRowClick(e, search.ReferenceNumber)}
                            onMouseEnter={() => setHovered(search)}
                            onMouseLeave={() => setHovered(undefined)}>
                            <Grid item sm={8}>
                              {search.ReferenceNumber}
                            </Grid>
                            <Grid item sm={3}>
                              {/* {MappingQuoteStatus(search)} */}
                            </Grid>
                          </Grid>
                          <Grid container spacing={1} sm={1} item>
                            <a href={`/Quote/${search.ReferenceNumber}`} target="_blank">
                              <CallMadeIcon color="primary" />
                            </a>
                          </Grid>
                        </ListItem>
                      </div>
                    )
                )}
              </List>
            </Grid>
            <br />
            <br />
            <Grid container item spacing={1} xs={12}>
              <List className="w-100">
                {dummySearchResult.map(
                  (search, i) =>
                    search.__typename === 'Client' && (
                      <div className={`${i === cursor ? classes.active : ''}`}>
                        <ListItem key={i} button>
                          <Grid
                            container
                            spacing={1}
                            onClick={e => handleRowClientClick(e, `/Client/${search.Code}`)}
                            onMouseEnter={() => setHovered(search)}
                            onMouseLeave={() => setHovered(undefined)}>
                            <Grid item sm={8}>
                              {search.Name}
                            </Grid>
                            <Grid item sm={3}>
                              {search.Broker?.Email}
                            </Grid>
                          </Grid>
                          <Grid container spacing={1} sm={1} item>
                            <a href={`/Client/${search.Code}`} target="_blank">
                              <CallMadeIcon color="primary" />
                            </a>
                          </Grid>
                        </ListItem>
                      </div>
                    )
                )}
              </List>
            </Grid>
          </div>
        </Container>
      </Drawer>
      <KeyboardEventHandler
        handleFocusableElements={true}
        handleKeys={['ctrl+s']}
        onKeyEvent={(key, e) => {
          e.preventDefault()
          setState(!state)
        }}
      />
    </>
  )
}

export default HeaderSearch
