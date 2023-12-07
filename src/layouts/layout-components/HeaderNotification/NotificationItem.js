import React from 'react'

import avatar2 from 'assets/images/avatars/avatar2.jpg'


import { Avatar, Grid, Typography, useMediaQuery, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },

    medium: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },

    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: 'blue',
        position: 'absolute',
        top: '5px',
        right: '5px',
    },
}));

export default function NotificationItem() {
    const classes = useStyles();
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return (
        <Grid
            container
            alignItems='center'
            justifyContent="center"
            gap={4}
            style={{
                borderBottom: '1px solid #ddd',
                padding: isSmallScreen ? '3px' : '7px', // Adjust the padding
                position: 'relative', // Add position relative to the container
            }}
        >
            <Grid item xs={1} md={2} lg={2}>
                <Avatar className={isSmallScreen ? classes.small : classes.large} alt="..." src={avatar2} />
            </Grid>
            <Grid item xs={10} md={9} lg={9}>
                <Typography variant='h5' color='textPrimary' style={{ fontWeight: 'bold' }}>
                    Cập nhật thông tin
                </Typography>
                <div>
                    <span style={{fontSize: isSmallScreen ? '13px': '16px'}}>
                        Bùi Đỗ Duy Quân vừa mới thêm 1 đoàn sinh vào chi đoàn của bạn.
                    </span>
                </div>
                <div>
                    <span color='blue'>
                        10 min ago
                    </span>
                </div>
            </Grid>
            <Grid item xs={1} md={1} lg={1}>
                <div className={classes.dot}></div> {/* Add the blue dot */}
            </Grid>
        </Grid>
    )
}