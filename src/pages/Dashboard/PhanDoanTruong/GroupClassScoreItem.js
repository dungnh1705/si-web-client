import React, { useState } from 'react'
import { Grid, LinearProgress, ButtonGroup, Button } from '@material-ui/core'

// components
import Chart from 'react-apexcharts'
import _ from 'lodash'
import accounting from 'accounting'

// constance
import { Ranking } from 'app/enums'

export default function GroupClassScoreItem({ union }) {
  const [view, setView] = useState(1)

  const chartOptions = {
    chart: {
      id: 'group-class-score-item',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      },
      stacked: true
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
    colors: ['#7fe2ec', '#7fc8fd', '#ff98a4'],
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
      position: 'top'
    },
    labels: Ranking
  }

  const chartData = [
    {
      name: 'Học kỳ I',
      data: Ranking.map(e => _.size(union?.semesterOne?.filter(so => so.ranking === e)) ?? 0)
    },
    {
      name: 'Học kỳ II',
      data: Ranking.map(e => _.size(union?.semesterTwo?.filter(so => so.ranking === e)) ?? 0)
    },
    {
      name: 'Cả năm',
      data: Ranking.map(e => _.size(union?.scoreTotal?.filter(so => so.ranking === e)) ?? 0)
    }
  ]

  return (
    <>
      <Grid item xs={12} lg={3}>
        <Grid item>
          <ButtonGroup>
            <Button variant="contained" onClick={() => setView(1)} color={view === 1 ? 'primary' : 'default'}>
              HKI
            </Button>
            <Button variant="contained" onClick={() => setView(2)} color={view === 2 ? 'primary' : 'default'}>
              HKII
            </Button>
            <Button variant="contained" onClick={() => setView(3)} color={view === 3 ? 'primary' : 'default'}>
              Cả Năm
            </Button>
          </ButtonGroup>
        </Grid>
        <div className="p-5 mb-4 rounded bg-secondary">
          {Ranking.map((item, index) => {
            const total =
              view === 1
                ? _.size(union?.semesterOne?.filter(so => so.ranking === item)) ?? 0
                : view === 2
                ? _.size(union?.semesterTwo?.filter(so => so.ranking === item)) ?? 0
                : _.size(union?.scoreTotal?.filter(so => so.ranking === item)) ?? 0

            const percent = Number(accounting.toFixed((total / union.totalStudent) * 100, 1))

            return (
              <div className="mb-4" key={`union-score-${view}-${index}`}>
                <div className="line-height-1">
                  <span className="font-size-lg font-weight-bold pr-3">{total}</span>
                  <span className="text-muted">{item}</span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="flex-grow-1">
                    <LinearProgress value={percent} color="primary" variant="determinate" />
                  </div>
                  <div className="text-dark font-weight-bold pl-3">{percent} %</div>
                </div>
              </div>
            )
          })}
        </div>
      </Grid>
      <Grid item xs={12} lg={9}>
        <Chart options={chartOptions} series={chartData} type="bar" />
      </Grid>
    </>
  )
}
