import React from 'react'
import Chart from 'react-apexcharts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { Ranking } from 'app/enums'

import { Box, Card, CardContent, IconButton } from '@material-ui/core'
import { history } from 'App'
import _ from 'lodash'

const ScoreInfo = ({ info }) => {
  const chartData = {
    chart: {
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#4191ff', 'rgba(65, 145, 255, 0.35)'],
    fill: {
      opacity: 0.8,
      colors: ['#4191ff', 'rgba(65, 145, 255, 0.35)']
    },
    grid: {
      strokeDashArray: '5',
      borderColor: 'rgba(125, 138, 156, 0.3)'
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    legend: {
      show: false
    },
    labels: Ranking,
    series: [
      {
        name: 'Cả năm',
        data: [
          _.size(info?.scoreTotal?.filter(s => s.ranking === 'Xuất sắc')) ?? 0,
          _.size(info?.scoreTotal?.filter(s => s.ranking === 'Giỏi')) ?? 0,
          _.size(info?.scoreTotal?.filter(s => s.ranking === 'Khá')) ?? 0,
          _.size(info?.scoreTotal?.filter(s => s.ranking === 'Trung bình')) ?? 0,
          _.size(info?.scoreTotal?.filter(s => s.ranking === 'Yếu')) ?? 0,
          _.size(info?.scoreTotal?.filter(s => s.ranking === 'Kém')) ?? 0
        ]
      },
      {
        name: 'HKI',
        data: [
          _.size(info?.semesterOne?.filter(s => s.ranking === 'Xuất sắc')) ?? 0,
          _.size(info?.semesterOne?.filter(s => s.ranking === 'Giỏi')) ?? 0,
          _.size(info?.semesterOne?.filter(s => s.ranking === 'Khá')) ?? 0,
          _.size(info?.semesterOne?.filter(s => s.ranking === 'Trung bình')) ?? 0,
          _.size(info?.semesterOne?.filter(s => s.ranking === 'Yếu')) ?? 0,
          _.size(info?.semesterOne?.filter(s => s.ranking === 'Kém')) ?? 0
        ]
      }
    ]
  }

  return (
    <Card className="card-box mb-4">
      <div className="card-header">
        <div className="card-header--title">
          <h4 className="font-size-lg mb-0 py-2 font-weight-bold">Thông tin điểm</h4>
        </div>
        <div className="card-header--actions">
          <Box>
            <IconButton size="medium" variant="outlined" color="primary" onClick={() => history.push('/HT/StudentScore')}>
              <FontAwesomeIcon icon={faChevronRight} className="opacity-8 font-size-xs ml-1" />
            </IconButton>
          </Box>
        </div>
      </div>
      <CardContent className="p-3">
        <Chart options={chartData} series={chartData.series} type="bar" height={200} />
      </CardContent>
    </Card>
  )
}

export default ScoreInfo
