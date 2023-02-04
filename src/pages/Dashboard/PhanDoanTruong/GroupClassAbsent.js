import React from 'react'
import { Card } from '@material-ui/core'
import Slider from 'react-slick'

import GroupClassAbsentItem from './GroupClassAbsentItem'

export default function GroupClassAbsent({ info }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }

  return (
    <Card className="card-box mb-4">
      <div className="card-header">
        <div className="card-header--title">
          <h4 className="font-size-lg mb-0 py-2 font-weight-bold">Thống kê nghỉ Chi đoàn</h4>
        </div>
      </div>

      <Slider {...settings} style={{ padding: '10px' }}>
        {info?.summaryInfo?.map((item, index) => (
          <GroupClassAbsentItem item={item} index={index} key={`group-class-absent-${item.unionId}`} />
        ))}
      </Slider>
    </Card>
  )
}
