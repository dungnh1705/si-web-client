import React from 'react'
import { Grid, Box, LinearProgress, Card, IconButton } from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { history } from 'App'
import Chart from 'react-apexcharts'
import _ from 'lodash'

// constance
import { AbsentMode } from 'app/enums'
import accounting from 'accounting'

export default function GroupAbsent({ info }) {
  const chartOptions = {
    chart: {
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      },
      stacked: true,
      zoom: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: true
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '80%'
      }
    },
    colors: ['#7fc8fd', '#ff98a4'],
    fill: {
      opacity: 1
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    legend: {
      show: true,
      position: 'right'
    },
    labels: info?.summaryInfo.map(item => {
      return `Chi đoàn ${item.unionCode}`
    })
  }

  const chartData = [
    {
      name: 'Nghỉ lễ',
      data: info?.summaryInfo.map(item => {
        return _.size(item.absents.filter(ab => ab.absentMode === AbsentMode.Mass))
      })
    },
    {
      name: 'Nghỉ học',
      data: info?.summaryInfo.map(item => {
        return _.size(item.absents.filter(ab => ab.absentMode === AbsentMode.Class))
      })
    }
  ]

  const totalAbsentMass = _.sumBy(info?.summaryInfo, i => _.size(i.absents.filter(ab => ab.absentMode === AbsentMode.Mass)))
  const totalAbsentClass = _.sumBy(info?.summaryInfo, i => _.size(i.absents.filter(ab => ab.absentMode === AbsentMode.Class)))
  const massPercent = Number(accounting.toFixed((totalAbsentMass / (totalAbsentMass + totalAbsentClass)) * 100, 1))
  const classPercent = Number(accounting.toFixed((totalAbsentClass / (totalAbsentMass + totalAbsentClass)) * 100, 1))

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Card className="card-box mb-4">
          <div className="card-header">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 py-2 font-weight-bold">Thống kê nghỉ Phân đoàn</h4>
            </div>
            <div className="card-header--actions">
              <Box>
                <IconButton size="medium" variant="outlined" color="primary" onClick={() => history.push('/PDT/GroupAbsent')}>
                  <FontAwesomeIcon icon={faChevronRight} className="opacity-8 font-size-xs ml-1" />
                </IconButton>
              </Box>
            </div>
          </div>

          <div className="p-4">
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <div className="p-5 mb-4 rounded bg-secondary">
                  <div className="mb-4">
                    <div className="line-height-1">
                      <span className="font-size-lg font-weight-bold pr-3">{totalAbsentMass}</span>
                      <span className="text-muted">Nghỉ lễ</span>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="flex-grow-1">
                        <LinearProgress value={massPercent} variant="determinate" className="bar-mass" />
                      </div>
                      <div className="text-dark font-weight-bold pl-3">{massPercent} %</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="line-height-1">
                      <span className="font-size-lg font-weight-bold pr-3">{totalAbsentClass}</span>
                      <span className="text-muted">Nghỉ học</span>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="flex-grow-1">
                        <LinearProgress value={classPercent} variant="determinate" className="bar-class" />
                      </div>
                      <div className="text-dark font-weight-bold pl-3">{classPercent} %</div>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <Chart options={chartOptions} series={chartData} type="bar" />
              </Grid>
            </Grid>
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}
