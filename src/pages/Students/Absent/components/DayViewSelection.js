import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { LoadSundayList, SundaySelected, ReloadAbsentStudentList } from '../recoil'

import { Button, ButtonGroup } from '@material-ui/core'
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons'

const DayViewSelections = () => {
  const setSundaySelected = useSetRecoilState(SundaySelected)
  const setReloadAbsentStudentList = useSetRecoilState(ReloadAbsentStudentList)

  const [activeButton, setActiveButton] = useState('week')
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(0)

  const allSunday = useRecoilValue(LoadSundayList)

  const indexOfLastDateInFilterList = allSunday.indexOf(allSunday.filter(date => moment.utc(date) <= moment()).slice(-1)[0])

  const startMonthSemester = moment.utc(allSunday[0]).month()
  const endMonthSemester = moment.utc(allSunday.slice(-1)[0]).month()

  useEffect(() => {
    setSundaySelected(allSunday.filter(date => moment.utc(date) <= moment()).slice(-1))
    setCurrentWeekIndex(indexOfLastDateInFilterList)
    setCurrentMonth(moment().month())
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
        setCurrentMonth(moment().month())
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

  const changeMonth = nextMonth => {
    if (nextMonth < startMonthSemester || nextMonth > endMonthSemester) return

    setSundaySelected(allSunday.filter(date => moment.utc(date).month() === nextMonth))
    setCurrentMonth(nextMonth)
    setReloadAbsentStudentList(true)
  }

  const next = () => {
    if (activeButton === 'week') {
      changeWeek(currentWeekIndex + 1)
    } else if (activeButton === 'month') {
      changeMonth(currentMonth + 1)
    }
  }

  const previous = () => {
    if (activeButton === 'week') {
      changeWeek(currentWeekIndex - 1)
    } else if (activeButton === 'month') {
      changeMonth(currentMonth - 1)
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
