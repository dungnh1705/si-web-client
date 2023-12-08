import React, { useState, useEffect } from "react";
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTheme, useMediaQuery } from "@material-ui/core";

import { doGet } from "utils/axios";

import NotificationItem from "./NotificationItem";

export default function NotificationList({ userId, quantity, open }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'))

    const [pageSize, setPageSize] = useState(3)
    const [notifications, setNotifications] = useState([])
    useEffect(() => {
        async function fetchNotification() {
            try {
                const response = await doGet('notification/GetUserNotification', {
                    userId,
                    PageSize: pageSize,
                })
                setNotifications(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        if (open === true) fetchNotification()
    }, [pageSize])

    return (
        <div className={!isMobile ? "popover-custom-xl overflow-hidden" : "popover-custom-lg overflow-hidden"}>
            <div className="height-280" style={{
                width: isMobile ? "90vw" : '100%',
            }}>
                <PerfectScrollbar
                    onScrollDown={() => {
                        pageSize < quantity && setPageSize(pageSize + 3)
                    }}
                >
                    {Array.from({ length: quantity }).map((_, index) => (
                        <NotificationItem notification={notifications[index]} key={index} />
                    ))}
                </PerfectScrollbar>
            </div>
        </div>
    )
}