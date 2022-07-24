import React, { Fragment, useRef, useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { Grid, Fab, Container, InputAdornment, Drawer, IconButton, TextField, Divider, Typography } from '@material-ui/core'
import clsx from 'clsx'
import SearchIcon from '@material-ui/icons/Search'
import CallMadeIcon from '@material-ui/icons/CallMade'
import CloseTwoToneIcon from '@material-ui/icons/CloseTwoTone'
import Icon from '@material-ui/core/Icon'
import KeyboardEventHandler from 'react-keyboard-event-handler'
// import { createGqlClient } from 'utils/gqlUtil'
import config from 'config'
// import { QUOTES } from '../../gql/query/Quote'
// import { CLIENTS } from '../../gql/query/Client'
import { themeOptionsState } from 'recoils/atoms'

const HeaderSearch = () => {
  const { sidebarToggle } = useRecoilValue(themeOptionsState)
  const searchRef = useRef(null)

  const [dummySearchesQuotes, setDummySearchesQuotes] = useState([])

  const [dummySearchesClients, setDummySearchesClients] = useState([])

  const handleSearchChange = event => {
    setSearchValue(event.target.value)

    if (event.target.value) {
      if (!openSearchResults) {
        setOpenSearchResults(true)
      }
    } else {
      setOpenSearchResults(false)
    }
  }

  const [openSearchResults, setOpenSearchResults] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const [state, setState] = useState(false)

  const searchQuotes = value => {}

  const searchClients = value => {}

  useEffect(() => {
    searchQuotes(searchValue)
    searchClients(searchValue)
  }, [searchValue])

  return (
    <>
      {sidebarToggle && (
        <IconButton size="medium" onClick={() => setState(true)} color="inherit" className="btn-inverse font-size-xs" style={{ marginLeft: '64px' }}>
          <SearchIcon />
        </IconButton>
      )}

      {!sidebarToggle && (
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
                    placeholder="Search terms here…"
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
                <td style={{ width: '50px', paddingLeft: '20px' }}>
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
              <p className="text-black-50 font-size-lg">
                These are your results for <b className="text-black">{searchValue}</b>
              </p>
              <Divider />
            </div>
            <Grid container spacing={1}>
              {dummySearchesQuotes.map((search, i) => (
                <Fragment key={i}>
                  <Grid sm={8} item>
                    {search.ReferenceNumber}
                  </Grid>
                  <Grid sm={3} item>
                    {search.Status}
                  </Grid>
                  <Grid sm={1} item>
                    <div tabIndex={i}>
                      <CallMadeIcon color="primary" />
                    </div>
                  </Grid>
                </Fragment>
              ))}
            </Grid>
            <br />
            <br />
            <Grid container spacing={1}>
              {dummySearchesClients.map((search, i) => (
                <Fragment key={i}>
                  <Grid sm={8} item>
                    {search.Name}
                  </Grid>
                  <Grid sm={3} item>
                    {search.Broker?.Email}
                  </Grid>
                  <Grid sm={1} item>
                    <a href={`/Client/${search.Code}`}>
                      <CallMadeIcon color="primary" />
                    </a>
                  </Grid>
                </Fragment>
              ))}
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
