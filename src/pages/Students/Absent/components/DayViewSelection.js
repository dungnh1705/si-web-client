import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { LoadSundayList, SundaySelected, ReloadAbsentStudentList } from '../recoil'

import { Button, ButtonGroup } from '@material-ui/core'
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'
import { CurrentSemesterQuery } from 'recoils/selectors'

const DayViewSelections = () => {
  const setSundaySelected = useSetRecoilState(SundaySelected)
  const setReloadAbsentStudentList = useSetRecoilState(ReloadAbsentStudentList)

  const [activeButton, setActiveButton] = useState('week')
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(moment())

  const allSunday = useRecoilValue(LoadSundayList)
  const currentSemester = useRecoilValue(CurrentSemesterQuery)

  const indexOfLastDateInFilterList = allSunday.indexOf(allSunday.filter(date => moment.utc(date) <= moment()).slice(-1)[0])

  useEffect(() => {
    setSundaySelected(allSunday.filter(date => moment.utc(date) <= moment()).slice(-1))
    setCurrentWeekIndex(indexOfLastDateInFilterList)
  }, [])

  const defaultView = type => {
    // eslint-disable-next-line default-case
    switch (type) {
      case 'week':
        setSundaySelected(allSunday.filter(date => moment.utc(date) <= moment()).slice(-1))
        setCurrentWeekIndex(indexOfLastDateInFilterList)
        setActiveButton('week')
        break
      case 'month':
        setSundaySelected(allSunday.filter(date => moment.utc(date).month() === moment().month()))
        setCurrentMonth(moment())
        setActiveButton('month')
        break
      case 'semester':
        setSundaySelected(allSunday)
        setActiveButton('semester')
        break
    }
    setReloadAbsentStudentList(true)
  }

  const changeWeek = nextIndexDate => {
    if (nextIndexDate > allSunday.length - 1) return

    if (nextIndexDate < 0) {
      setCurrentWeekIndex(0)
      return
    }

    setSundaySelected([allSunday[nextIndexDate]])
    setCurrentWeekIndex(nextIndexDate)
    setReloadAbsentStudentList(true)
  }

  const changeMonth = monthDiff => {
    let newMonth = moment(currentMonth).add(monthDiff, 'month')
    if (newMonth <= moment(currentSemester.semesterFrom)) {
      newMonth = moment(currentSemester.semesterFrom)
    }
    if (newMonth >= moment(currentSemester.semesterTo)) {
      newMonth = moment(currentSemester.semesterTo)
    }

    setSundaySelected(allSunday.filter(date => moment.utc(date).month() === newMonth.month()))
    setCurrentMonth(newMonth)
    setReloadAbsentStudentList(true)
  }

  const next = () => {
    if (activeButton === 'week') {
      changeWeek(currentWeekIndex + 1)
    } else if (activeButton === 'month') {
      changeMonth(1)
    }
  }

  const previous = () => {
    if (activeButton === 'week') {
      changeWeek(currentWeekIndex - 1)
    } else if (activeButton === 'month') {
      changeMonth(-1)
    }
  }

  return (
    <ButtonGroup variant="contained" aria-label="contained primary button group">
      <Button onClick={previous} disabled={activeButton === 'semester' ? true : false}>
        <ArrowBackIos />
      </Button>
      <Button onClick={() => defaultView('week')} color={activeButton === 'week' ? 'primary' : 'default'}>
        Tuần
      </Button>
      <Button onClick={() => defaultView('month')} color={activeButton === 'month' ? 'primary' : 'default'}>
        Tháng
      </Button>
      <Button onClick={() => defaultView('semester')} color={activeButton === 'semester' ? 'primary' : 'default'} style={{ whiteSpace: 'nowrap' }}>
        Học kì
      </Button>
      <Button onClick={next} disabled={activeButton === 'semester' ? true : false}>
        <ArrowForwardIos />
      </Button>
    </ButtonGroup>
  )
}

export default DayViewSelections
