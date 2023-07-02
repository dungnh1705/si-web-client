import React from 'react'
import { ButtonGroup, Button, CardContent, Typography, Hidden } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { useRecoilState, useRecoilValue } from 'recoil'
import Slider from 'react-slick'

import { UnionSelected, UnionInGroupSelector } from 'pages/BanQuanTri/GroupInfo/recoil'

export default function GroupUnionList() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const unionInGroup = useRecoilValue(UnionInGroupSelector)
  const [selectedUnion, setSelectedUnion] = useRecoilState(UnionSelected)

  function handleClickUnion(unionId) {
    setSelectedUnion(unionId)
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 2.5 : 5.5,
    slidesToScroll: isMobile ? 2 : 3,
    nextArrow: <></>,
    prevArrow: <></>
  }

  return unionInGroup ? (
    <>
      <Hidden xsDown>
        <ButtonGroup variant="contained" aria-label="contained primary button group">
          {unionInGroup.map(union => (
            <Button onClick={() => handleClickUnion(union.unionId)} key={union.unionId} color={selectedUnion === union.unionId ? 'primary' : 'default'} size={'large'}>
              Chi đoàn {union.unionCode}
            </Button>
          ))}
        </ButtonGroup>
      </Hidden>
      <Hidden smUp>
        <Slider {...settings}>
          {unionInGroup.map(union => (
            <CardContent onClick={() => handleClickUnion(union.unionId)} key={union.unionId}>
              <Typography variant="h4" className={`carousel-header ${selectedUnion === union.unionId ? 'carousel-header__active' : ''}`}>
                Chi đoàn {union.unionCode}
              </Typography>
            </CardContent>
          ))}
        </Slider>
      </Hidden>
    </>
  ) : (
    <></>
  )
}
