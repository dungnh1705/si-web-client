import React, { useEffect } from 'react'
import { useTheme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { Grid } from '@material-ui/core'

import { useRecoilState, useSetRecoilState } from 'recoil'
import { UnionSelected, ActiveButton, ActiveStep } from '../recoil'

function SwipeableTextMobileStepper({ lstUnion }) {
  const theme = useTheme()
  const [unionSelected, setUnionSelected] = useRecoilState(UnionSelected)

  const setActiveButton = useSetRecoilState(ActiveButton)
  const [activeStep, setActiveStep] = useRecoilState(ActiveStep)

  useEffect(() => {
    const indexOfCurrentUnionInList = lstUnion.findIndex(union => union.unionId === unionSelected?.unionId)
    indexOfCurrentUnionInList === -1 ? setActiveStep(0) : setActiveStep(indexOfCurrentUnionInList)
    setActiveButton(unionSelected?.unionId)
    setUnionSelected(unionSelected)
  }, [])

  const maxSteps = lstUnion.length

  const handleNext = () => {
    setActiveButton(lstUnion[activeStep + 1].unionId)
    setUnionSelected(lstUnion[activeStep + 1])
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveButton(lstUnion[activeStep - 1].unionId)
    setUnionSelected(lstUnion[activeStep - 1])
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleStepChange = step => {
    setActiveButton(lstUnion[step].unionId)
    setUnionSelected(lstUnion[step])
    setActiveStep(step)
  }

  return (
    <Grid item container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={3}>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          <KeyboardArrowLeft />
        </Button>
      </Grid>

      <Grid item xs={5}>
        <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={activeStep} onChangeIndex={handleStepChange}>
          {lstUnion.map((union, index) => (
            <div>
              {Math.abs(activeStep - index) <= 2 ? (
                <Button variant="contained" color={activeStep === index ? 'primary' : 'default'} style={{ whiteSpace: 'nowrap' }}>
                  Chi đoàn {union.unionCode} - {union?.students.length}
                </Button>
              ) : null}
            </div>
          ))}
        </SwipeableViews>
      </Grid>

      <Grid item xs={3}>
        <Button onClick={handleNext} disabled={activeStep === maxSteps - 1}>
          <KeyboardArrowRight />
        </Button>
      </Grid>
    </Grid>
  )
}

export default SwipeableTextMobileStepper
