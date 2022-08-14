import React from 'react'
import { Grid, Box, LinearProgress, Card, IconButton, Divider, Typography } from '@material-ui/core'

// constance
import Slider from 'react-slick'
import GroupClassScoreItem from './GroupClassScoreItem'

export default function GroupClassScoreInfo({ info }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card className="mb-4">
          <div className="card-header">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 py-2 font-weight-bold">Thống kê điểm Chi đoàn</h4>
            </div>
          </div>
          <div className="mx-4 divider" />
          <div className="mx-4 divider" />

          <Slider {...settings} style={{ padding: '10px' }}>
            {info?.summaryInfo?.map(item => (
              <div className="p-2">
                <Grid container spacing={2}>
                  <Grid container item xs={12} justifyContent="center">
                    <Typography variant="h4">Chi đoàn {item.unionCode}</Typography>
                  </Grid>
                  <GroupClassScoreItem union={item} />
                </Grid>
              </div>
            ))}
          </Slider>
        </Card>
      </Grid>
    </Grid>
  )
}
