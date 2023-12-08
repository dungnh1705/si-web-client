import React, { Fragment } from 'react'

import { IconButton, Box, Popover, useMediaQuery, useTheme } from '@material-ui/core'
import { useRecoilValue } from 'recoil'
import NotificationsActiveTwoToneIcon from '@material-ui/icons/NotificationsActiveTwoTone'

import NotificationList from './NotificationList'
import sessionHelper from 'utils/sessionHelper'
import { NumberNotification } from 'recoils/selectors'

export default function HeaderNotification() {
    const userId = sessionHelper().userId
    const quantity = useRecoilValue(NumberNotification)

    const [anchorEl, setAnchorEl] = React.useState(null)

    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }
    const open = Boolean(anchorEl)

    return (
        <Fragment>
            <div className="d-flex align-items-center popover-header-wrapper">
                <Box component="span" pr="2">
                    <IconButton size='medium' onClick={handleClick} color="inherit" className="btn-inverse mx-1 d-50">
                        <div className="badge badge-pill badge-warning badge-header">{quantity}</div>
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

                        <NotificationList userId={userId} quantity={quantity} open={open} />

                    </Popover>
                </Box>
            </div>
        </Fragment>
    )
}
