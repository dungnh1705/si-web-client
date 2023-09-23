import React  from 'react'

import { makeStyles, Hidden } from '@material-ui/core'

import {  useRecoilValue } from 'recoil'

import { AbsentMode } from 'app/enums'
import { HolyNameQuery } from 'recoils/selectors'
import ControlledOpenSelect from './Selection'

// import StudentTeamItemDetails from './StudentTeamItemDetails'

import {LoadStudentAbsent} from './recoil'
import studentAbsent from './StudentAbsent'
import moment from 'moment'

const useStyle = makeStyles({
  pinCell: {
    position: 'sticky',
    left: 0,
    backgroundColor: 'white',
    zIndex: 1,

    '&::after': {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '2.5px',
      zIndex: 2,
      content: '""',
      backgroundColor: '#E5E6F5'
    }
  }
})

const StudentTeamItem = ({ student, SundayList }) => {
  const classStyle = useStyle()

  const lstHolyname = useRecoilValue(HolyNameQuery)
  const AbsentList = useRecoilValue(LoadStudentAbsent)

  const StudentAbsent = AbsentList?.map(month => month.item.filter(i => i.studentId === student.id)
                                                            .map(i => ({...i, dateAbsent: moment.utc(i.dateAbsent)})))
  
  const checkDateAndPermissionAndMode = (CurDate, ListDate) => {
    let dateAbsentObj = []
    for (let month of ListDate){
      dateAbsentObj = month?.filter(d => {
          return d.dateAbsent._d.getTime() === CurDate._d.getTime()
        })
      if (dateAbsentObj.length >= 1) break
    }

    if (dateAbsentObj?.length === 2){
      //length = 2 => absent both mass and class
      return [2, Number(dateAbsentObj[0]?.hasPermission), Number(dateAbsentObj[1]?.hasPermission), dateAbsentObj]
    } else if (dateAbsentObj?.length === 1) {
      //length = 1 => absent either mass or class
      return [1, dateAbsentObj[0]?.absentMode, Number(dateAbsentObj[0].hasPermission), dateAbsentObj]
    } else
      return [0, "-1", "-1", dateAbsentObj]
  }

  return (
    <>
      <tr style={{ cursor: 'pointer' }}>
        <td className={classStyle.pinCell}>
          {lstHolyname.find(h => h.id === student.stuHolyId).name}&nbsp;
            <Hidden mdUp>
              <br />
            </Hidden> 
            {student.stuFirstName} {student.stuLastName}
        </td>
          {SundayList.map((date) => {
            const [type, data1, data2, dateAbsentObj] = checkDateAndPermissionAndMode(date, StudentAbsent)
            //type is the length of absentobj => 1 means absent either mass or class
             if(type === 1) {
                 return  (<>
                      {/*check absent mode*/}
                     <td style={{alignItems:'center'}}><ControlledOpenSelect Permission={data1 === 1?data2:"-1"} date={new Date(date)} mode={1} StuId={student.id} dateAbsentObj={dateAbsentObj[0]}/></td>
                     <td style={{alignItems:'center'}}><ControlledOpenSelect Permission={data1 === 1?"-1":data2} date={new Date(date)} mode={2} StuId={student.id} dateAbsentObj={dateAbsentObj[0]}/></td>
                    </>) 
              }
              return (
                <>
                  <td><ControlledOpenSelect Permission={data1} date={new Date(date)} mode={1} StuId={student.id} dateAbsentObj={type===2?dateAbsentObj[0]:null}/></td>
                  <td><ControlledOpenSelect Permission={data2} date={new Date(date)} mode={2} StuId={student.id} dateAbsentObj={type===2?dateAbsentObj[1]:null}/></td>
                </>
              )
            }
          )}


      </tr>
      {/*{showDetail.some(d => d === student.stuCode) && (*/}
      {/*  <tr style={{ backgroundColor: 'white' }}>*/}
      {/*    <td colSpan={7}>*/}
      {/*      <StudentTeamItemDetails student={student} key={student.stuCode + 1} />*/}
      {/*    </td>*/}
      {/*  </tr>*/}
      {/*)}*/}
    </>
  )
}

export default StudentTeamItem
