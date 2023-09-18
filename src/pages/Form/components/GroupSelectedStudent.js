import React, { Fragment, Suspense } from 'react'
import { Button, ButtonGroup, CardContent, Hidden, LinearProgress, Typography } from '@material-ui/core'
import Slider from 'react-slick'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { groupUnionSelectedAtom, unionInGroupQuery } from '../recoil'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import UnionSelectedStudent from './UnionSelectedStudent'

export default function() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const unionInGroup = useRecoilValue(unionInGroupQuery)
  const [selectedUnion, setSelectedUnion] = useRecoilState(groupUnionSelectedAtom)

  const handleClickUnion = (unionId) => {
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

  return <Fragment>
    <Hidden xsDown>
      <ButtonGroup variant='contained' aria-label='contained primary button group'>
        {unionInGroup?.map(union => (
          <Button onClick={() => handleClickUnion(union.unionId)} key={union.unionId}
                  color={selectedUnion === union.unionId ? 'primary' : 'default'} size={'large'}>
            Chi đoàn {union.unionCode}
          </Button>
        ))}
      </ButtonGroup>
    </Hidden>
    <Hidden smUp>
      <Slider {...settings}>
        {unionInGroup?.map(union => (
          <CardContent onClick={() => handleClickUnion(union.unionId)} key={union.unionId}>
            <Typography variant='h4'
                        className={`carousel-header ${selectedUnion === union.unionId ? 'carousel-header__active' : ''}`}>
              Chi đoàn {union.unionCode}
            </Typography>
          </CardContent>
        ))}
      </Slider>
    </Hidden>

    {selectedUnion &&
      <Suspense fallback={<LinearProgress />}>
        <UnionSelectedStudent />
      </Suspense>
    }

  </Fragment>
}
