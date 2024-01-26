import React, { Fragment, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { IconButton, Box, Popover } from '@material-ui/core'
import NotificationsActiveTwoToneIcon from '@material-ui/icons/NotificationsActiveTwoTone'

import sessionHelper from 'utils/sessionHelper'
import { doGet } from 'utils/axios'
import { loadNumUnReadNoti, loadTotalNoti } from 'recoils/atoms'

import FilterTab from './component/FilterTab'
import HeaderAction from './HeaderAction'
import NotificationList from './NotificationList'

export default function HeaderNotification() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [numUnRead, setNumUnRead] = useState(0)
  const [total, setTotal] = useState(0)
  const [iTab, setITab] = useState(0)

  const open = Boolean(anchorEl)
  const userId = sessionHelper().userId

  const loadNumUnRead = useRecoilValue(loadNumUnReadNoti)
  const loadTotal = useRecoilValue(loadTotalNoti)

  const handleChangeTab = () => {
    iTab === 0 ? setITab(1) : setITab(0)
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    async function fetchNumberUnReadNotification() {
      const response = await doGet('notification/count', { userId })
      const { data } = response.data
      setNumUnRead(data)
    }

    fetchNumberUnReadNotification()
  }, [loadNumUnRead])

  useEffect(() => {
    async function fetchTotalNotification() {
      const response = await doGet('notification/Total', { userId })
      const { data } = response.data
      setTotal(data)
    }
    fetchTotalNotification()
  }, [loadTotal])

  return (
    <Fragment>
      <div className="d-flex align-items-center popover-header-wrapper">
        <Box component="span" pr="2">
          <IconButton size="medium" onClick={handleClick} color="inherit" className="btn-inverse mx-1 d-50">
            {<div className="badge badge-pill badge-warning badge-header">{numUnRead !== 0 && (numUnRead > 10 ? '10+' : numUnRead)}</div>}
            <NotificationsActiveTwoToneIcon />
          </IconButton>
          <Popover
            open={open}
            onClose={handleClose}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            classes={{
              paper: 'app-header-dots'
            }}>
            <div
              style={{
                height: !iTab ? (total === 0 ? '280px' : 'auto') : numUnRead === 0 ? '280px' : 'auto'
              }}>
              <HeaderAction />
              <FilterTab value={iTab} handleChange={handleChangeTab} />
              <NotificationList userId={userId} total={!iTab ? total : numUnRead} open={open} tab={iTab} />
            </div>
          </Popover>
        </Box>
      </div>
    </Fragment>
  )
}
