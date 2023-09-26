import { atom, selector } from 'recoil'
import _ from 'lodash'

import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { Roles } from 'app/enums'

export const ReloadStudentAbsent = atom({
  key: 'ReloadStudentAbsent',
  default: 0
})

export const OpenAbsentForm = atom({
  key: 'OpenAbsentForm',
  default: false
})

export const UnionCodeFilter = atom({
  key: 'UnionCodeFilter',
  default: 1
})

export const AbsentUnionSelected = atom({
  key: 'AbsentUnionSelected',
  default: undefined
})

export const ShowConfirmDialog = atom({
  key: 'ShowConfirmDialog',
  default: false
})

export const AbsentSelected = atom({
  key: 'AbsentSelected',
  default: undefined
})

export const ReloadAbsentStudentList = atom({
  key: 'ReloadAbsentStudentList',
  default: 1
})

export const LoadStudentAbsent = selector({
  key: 'LoadStudentAbsent',
  get: async ({ get }) => {
    get(ReloadStudentAbsent)
    const unionCode = get(UnionCodeFilter)
    const unionId = get(AbsentUnionSelected)
    if (!unionId) return null

    const { classId, userId, scholasticId, roles } = sessionHelper()

    try {
      const res = await doGet(`student/getAbsent`, { scholasticId: scholasticId, classCode: classId, userId: userId })
      if (res && res.data.success && res.data.data) {
        const result = []

        for (let stu of res.data.data) {
          let [year, month] = stu.dateAbsent.match(/\d+/g)

          if (
            // unionId = 0 là PĐT, unionId = 1 là Kỷ Luật
            roles.includes(Roles.PhanDoanTruong) || roles.includes(Roles.KyLuat)
              ? stu.student.studentClass.find(sc => sc.class?.scholasticId === Number(scholasticId))?.union?.unionCode === unionCode
              : stu.student.studentClass.find(sc => sc.class?.scholasticId === Number(scholasticId))?.union?.unionId === unionId
          ) {
            if (!result.find(re => re.year === `${month}/${year}`)) result.push({ year: `${month}/${year}`, item: [] })
            result.forEach(re => {
              if (re.year === `${month}/${year}`) re.item.push(stu)
            })
          }
        }

        return result
      }
    } catch (err) {
      return null
    }
  }
})

export const LoadSundayList = selector({
  key: 'LoadSundayList',
  get: async () => {
    const { scholasticId } = sessionHelper()

    try {
      const res = await doGet(`student/getSchoolDates`, { scholasticId, semesterCode: 'null' })

      if (res && res.data.success) {
        return res.data.data.map(item => item.schoolDate)
      }
    } catch (err) {
      return []
    }
  }
})

export const StudentListQuery = selector({
  key: 'studentListQuery',
  get: async ({ get }) => {
    get(ReloadAbsentStudentList)
    const { classId } = sessionHelper()
    const unionId = get(AbsentUnionSelected)

    try {
      const res = await doGet(`student/getStudentInUnion`, { classId, unionId })

      if (res && res.data.success) {
        const { data } = res.data

        const distinctTeam = [...new Set(data?.map(x => x.studentClass.find(sc => Number(sc.classId) === Number(classId))?.team))]
        const lstStudent = []

        for (const t of distinctTeam) {
          lstStudent.push({ team: t, students: [] })
        }

        for (const student of data) {
          lstStudent.forEach(t => {
            if (t.team === student.studentClass.find(sc => Number(sc.classId) === Number(classId)).team) {
              if (student.studentClass.find(sc => Number(sc.classId) === Number(classId)).isTeamLead) {
                t.students.push({ ...student, isTeamLead: true })
              } else {
                t.students.push({ ...student, isTeamLead: false })
              }
            }
          })
        }

        return _.orderBy(lstStudent, ['team'], ['asc'])
      }

      return []
    } catch (err) {
      return []
    }
  }
})

export const ReloadStudentDetailsWithAbsentList = atom({
  key: 'ReloadStudentDetailsWithAbsentList',
  default: []
})

export const GetTeamsInUnionQuery = selector({
  key: 'GetTeamsInUnionQuery',
  get: async ({ get }) => {
    const unionId = get(AbsentUnionSelected)
    const { classId } = sessionHelper()

    if (unionId) {
      const res = await doGet(`class/getTeamsInUnion`, { classId, unionId })
      if (res && res.data.success) {
        const { data } = res.data
        return data
      }
    }
    return []
  }
})
