import React, { Fragment } from 'react'

import { IconButton, Box, Popover, useMediaQuery, useTheme } from '@material-ui/core'
import NotificationsActiveTwoToneIcon from '@material-ui/icons/NotificationsActiveTwoTone'
import PerfectScrollbar from 'react-perfect-scrollbar'

import NotificationItem from './NotificationItem'

export default function HeaderNotification() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
                        <div className="badge badge-pill badge-warning badge-header">3</div>
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
                        <div className={ !isMobile? "popover-custom-xl overflow-hidden" : "popover-custom-lg overflow-hidden"}>
                            <div className="height-280">
                                <PerfectScrollbar>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <NotificationItem key={i} />
                                    ))}
                                </PerfectScrollbar>
                            </div>
                        </div>
                    </Popover>
                </Box>
            </div>
        </Fragment>
    )
}
