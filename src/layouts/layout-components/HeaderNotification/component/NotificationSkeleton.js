import React from "react";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export default function NotificationSkeleton({ isMobile }) {
    return (
        <Grid
            container
            alignItems='center'
            justifyContent="center"
            gap={4}
            style={{
                position: 'relative',
                borderBottom: '1px solid #ddd',
                padding: isMobile ? '3px' : '7px',
            }}>
            <Grid item xs={2} md={2} lg={2}>
                <Skeleton variant="circle" width={40} height={40} style={{
                    margin: 'auto'
                }}/>
            </Grid>
            <Grid item xs={8} md={9} lg={9}>
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="100%" height={20} />
            </Grid>
            <Grid item xs={2} md={1} lg={1}>
                <Skeleton variant="circle" width={10} height={10} style={{
                    margin: 'auto'
                }}/>
            </Grid>
        </Grid>
    )
}