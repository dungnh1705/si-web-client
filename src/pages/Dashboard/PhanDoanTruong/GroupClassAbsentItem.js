import React from 'react'
import { CardContent, Grid, Typography } from '@material-ui/core'
import Chart from 'react-apexcharts'

import { size } from 'lodash'
import { AbsentMode } from 'app/enums'

export default function GroupClassAbsentItem({ item, index }) {
  const chartData = {
    chart: {
      id: `GroupClassAbsent-${item.unionId}-${index}`,
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
    },
    series: [
      {
        name: 'Không phép',
        data: [
          size(item?.absents?.filter(a => a.absentMode === AbsentMode.Mass && !a.hasPermission)) ?? 0,
          size(item?.absents?.filter(a => a.absentMode === AbsentMode.Class && !a.hasPermission)) ?? 0
        ]
      },
      {
        name: 'Có phép',
        data: [
          size(item?.absents?.filter(a => a.absentMode === AbsentMode.Mass && a.hasPermission)) ?? 0,
          size(item?.absents?.filter(a => a.absentMode === AbsentMode.Class && a.hasPermission)) ?? 0
        ]
      }
    ]
  }

  return (
    <CardContent className="p-3" key={`union-absent-${index}`}>
      <Grid container item xs={12} justifyContent="center">
        <Typography variant="h4">Chi đoàn {item.unionCode}</Typography>
      </Grid>

      <Chart options={chartData} series={chartData.series} type="bar" height={325} />
    </CardContent>
  )
}
