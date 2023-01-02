import React, { useEffect, useState } from 'react'
import { Grid, Card, Box, IconButton, CardContent } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash'
import accounting from 'accounting'

import Chart from 'react-apexcharts'
import Circle from 'react-circle'
import { history } from 'App'
import { AbsentMode } from 'app/enums'

const AbsentInfo = ({ info, absentMode }) => {
  const [result, setResult] = useState([])

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
      enabled: false
    },
    plotOptions: {
      bar: {
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
      show: false
    },
    labels: result?.map(e => e.monthYear),
    xaxis: {
      crosshairs: {
        width: 1
      }
    },
    yaxis: {
      min: 0
    }
  }

  const chartData = [
    {
      name: 'Không phép',
      data: result?.map(e => _.size(e?.item?.filter(a => Number(a.absentMode) === absentMode && !a.hasPermission) ?? 0)) ?? []
    },
    {
      name: 'Có phép',
      data: result?.map(e => _.size(e?.item?.filter(a => Number(a.absentMode) === absentMode && a.hasPermission) ?? 0)) ?? []
    }
  ]

  useEffect(() => {
    function fetchData() {
      let data = []
      if (info?.absents) {
        for (const absent of info?.absents) {
          const [year, month] = absent.dateAbsent.match(/\d+/g)

          if (!data.find(re => re.monthYear === `${month}/${year}`)) data.push({ monthYear: `${month}/${year}`, item: [] })

          data.forEach(re => {
            if (re.monthYear === `${month}/${year}`) re.item.push(absent)
          })
        }
      }

      setResult(data)
    }

    fetchData()
  }, [info])

  const massNoPermission = accounting.toFixed((_.size(info?.absents?.filter(a => Number(a.absentMode) === absentMode && !a.hasPermission)) / _.size(info?.absents)) * 100, 1)
  const massPermission = accounting.toFixed((_.size(info?.absents?.filter(a => Number(a.absentMode) === absentMode && a.hasPermission)) / _.size(info?.absents)) * 100, 1)

  return (
    <Card className="card-box mb-4">
      <div className="card-header">
        <div className="card-header--title">
          <h4 className="font-size-lg mb-0 py-2 font-weight-bold">{Number(absentMode) === AbsentMode.Mass ? 'Nghỉ lễ' : 'Nghỉ học'}</h4>
        </div>
        <div className="card-header--actions">
          <Box>
            <IconButton size="medium" variant="outlined" color="primary" onClick={() => history.push('/HT/ClassAbsent')}>
              <FontAwesomeIcon icon={faChevronRight} className="opacity-8 font-size-xs ml-1" />
            </IconButton>
          </Box>
        </div>
      </div>
      <CardContent className="p-3">{result.length > 0 && <Chart options={chartOptions} series={chartData} type="bar" height={325} />}</CardContent>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} className="d-flex justify-content-center">
          <div className="divider-v divider-v-lg" />
          <div>
            <div className="d-flex align-items-center justify-content-center text-uppercase text-black-50 pb-3">
              <span className="badge-circle mr-2 badge badge-danger">total</span>
              <span>Không phép</span>
            </div>
            <Circle
              animate={true} // Boolean: Animated/Static progress
              animationDuration="3s" //String: Length of animation
              responsive={false} // Boolean: Make SVG adapt to parent size
              size={160} // Number: Defines the size of the circle.
              lineWidth={22} // Number: Defines the thickness of the circle's stroke.
              progress={massNoPermission} // Number: Update to change the progress and percentage.
              progressColor="#f83245" // String: Color of "progress" portion of circle.
              bgColor="#e8e9ef" // String: Color of "empty" portion of circle.
              textColor="#3b3e66" // String: Color of percentage text color.percentSpacing={10} // Number: Adjust spacing of "%" symbol and number.
              roundedStroke={true}
              textStyle={{
                fontSize: '80px'
              }} // Boolean: Rounded/Flat line ends
              showPercentage={true} // Boolean: Show/hide percentage.
              showPercentageSymbol={true} // Boolean: Show/hide only the "%" symbol.
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={6} className="d-flex justify-content-center">
          <div>
            <div className="d-flex align-items-center justify-content-center text-uppercase text-black-50 pb-3">
              <span className="badge-circle mr-2 badge badge-success">available</span>
              <span>Có phép</span>
            </div>
            <Circle
              animate={true} // Boolean: Animated/Static progress
              animationDuration="3s" //String: Length of animation
              responsive={false} // Boolean: Make SVG adapt to parent size
              size={160} // Number: Defines the size of the circle.
              lineWidth={22} // Number: Defines the thickness of the circle's stroke.
              progress={massPermission} // Number: Update to change the progress and percentage.
              progressColor="#1bc943" // String: Color of "progress" portion of circle.
              bgColor="#e8e9ef" // String: Color of "empty" portion of circle.
              textColor="#3b3e66" // String: Color of percentage text color.percentSpacing={10} // Number: Adjust spacing of "%" symbol and number.
              roundedStroke={true}
              textStyle={{
                fontSize: '80px'
              }} // Boolean: Rounded/Flat line ends
              showPercentage={true} // Boolean: Show/hide percentage.
              showPercentageSymbol={true} // Boolean: Show/hide only the "%" symbol.
            />
          </div>
        </Grid>
      </Grid>
    </Card>
  )
}

export default AbsentInfo
