import { Button, ButtonGroup, CardContent, Hidden, Typography } from '@material-ui/core'
import Slider from 'react-slick'
import React, { Fragment, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { UnionScoreSelected } from 'recoils/atoms'
import { UnionQuery } from 'recoils/selectors'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 2.5,
  slidesToScroll: 2,
  nextArrow: <></>,
  prevArrow: <></>
}

export default function SelectUnion() {
  const lstUnion = useRecoilValue(UnionQuery)

  const [selectedUnion, setSelectedUnion] = useRecoilState(UnionScoreSelected)

  const handleClickUnion = unionId => {
    setSelectedUnion(unionId)
  }

  useEffect(() => {
    if (!selectedUnion) setSelectedUnion(lstUnion[0]?.unionId)
  }, [])

  return (
    <Fragment>
      <Hidden xsDown>
        <ButtonGroup variant="contained" aria-label="contained primary button group" className={'mb-4'}>
          {lstUnion?.map(union => (
            <Button onClick={() => handleClickUnion(union.unionId)} key={union.unionId} color={selectedUnion === union.unionId ? 'primary' : 'default'} size={'large'}>
              Chi đoàn {union.unionCode}
            </Button>
          ))}
        </ButtonGroup>
      </Hidden>

      <Hidden smUp>
        <Slider {...settings}>
          {lstUnion?.map(union => (
            <CardContent onClick={() => handleClickUnion(union.unionId)} key={union.unionId}>
              <Typography variant="h4" className={`carousel-header ${selectedUnion === union.unionId ? 'carousel-header__active' : ''}`}>
                Chi đoàn {union.unionCode}
              </Typography>
            </CardContent>
          ))}
        </Slider>
      </Hidden>
    </Fragment>
  )
}
