import React from 'react'
import { Typography, CardContent } from '@material-ui/core'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Slider from 'react-slick'

import { UnionSelected, UnionInGroupSelector } from 'pages/BanQuanTri/GroupInfo/recoil'

export default function GroupUnionList() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const unionInGroup = useRecoilValue(UnionInGroupSelector)
  const [selectedUnion, setSelectedUnion] = useRecoilState(UnionSelected)

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 2.5 : 5.5,
    slidesToScroll: isMobile ? 2 : 3,
    nextArrow: <></>,
    prevArrow: <></>
  }

  function handleClickUnion(unionId) {
    setSelectedUnion(unionId)
  }

  // React.useEffect(() => {
  //   if (!selectedUnion) setSelectedUnion(unionInGroup[0]?.unionId)
  // }, [unionInGroup])

  return (
    <Slider {...settings}>
      {unionInGroup &&
        unionInGroup.map(union => (
          <CardContent onClick={() => handleClickUnion(union.unionId)} key={union.unionId}>
            <Typography variant="h4" className={`carousel-header ${selectedUnion === union.unionId ? 'carousel-header__active' : ''}`}>
              Chi đoàn {union.unionCode}
            </Typography>
          </CardContent>
        ))}
    </Slider>
  )
}
