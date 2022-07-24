import React from 'react'
import { Card, CardContent, Grid, Typography } from '@material-ui/core'
import Chart from 'react-apexcharts'
import Slider from 'react-slick'

// icons
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

// import { history } from 'App'
import _ from 'lodash'
import { AbsentMode } from 'app/enums'

export default function GroupClassAbsent({ info }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  const chartOptions = {
    chart: {
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      },
      stacked: false
    },
    dataLabels: {
      enabled: true
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '50%'
      }
    },
    stroke: {
      show: true,
      width: 0,
      colors: ['transparent']
    },
    colors: ['#f83245', '#1bc943'],
    fill: {
      opacity: 1
    },
    legend: {
      show: true
    },
    labels: ['Nghỉ lễ', 'Nghỉ học'],
    xaxis: {
      crosshairs: {
        width: 1
      }
    },
    yaxis: {
      min: 0
    }
  }

  return (
    <Card className="card-box mb-4">
      <div className="card-header">
        <div className="card-header--title">
          <h4 className="font-size-lg mb-0 py-2 font-weight-bold">Thống kê nghỉ Chi đoàn</h4>
        </div>
      </div>

      <Slider {...settings} style={{ padding: '10px' }}>
        {info?.summaryInfo?.map(item => {
          const chartData = [
            {
              name: 'Không phép',
              data: [
                _.size(item.absents?.filter(a => a.absentMode == AbsentMode.Mass && !a.hasPermission)),
                _.size(item.absents?.filter(a => a.absentMode == AbsentMode.Mass && a.hasPermission))
              ]
            },
            {
              name: 'Có phép',
              data: [
                _.size(item.absents?.filter(a => a.absentMode == AbsentMode.Class && !a.hasPermission)),
                _.size(item.absents?.filter(a => a.absentMode == AbsentMode.Class && a.hasPermission))
              ]
            }
          ]

          return (
            <CardContent className="p-3">
              <Grid container item xs={12} justifyContent="center">
                <Typography variant="h4">Chi đoàn {item.unionId}</Typography>
              </Grid>
              <Chart options={chartOptions} series={chartData} type="bar" height={325} />
            </CardContent>
          )
        })}
      </Slider>
    </Card>
  )
}
