import { atom, selector, selectorFamily } from 'recoil'
import _ from 'lodash'

import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { HolyNameQuery } from 'recoils/selectors'
import { Roles, StudentStatus } from 'app/enums'

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
  default: 1
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

export const LoadListStudent = selector({
  key: 'LoadListStudent',
  get: async ({ get }) => {
    const { classId, userId, scholasticId, roles, unionId } = sessionHelper()
    const lstHolyName = get(HolyNameQuery)

    try {
      var res =
        Number(classId) !== 0 && !roles.includes(Roles.HocTap) && !roles.includes(Roles.PhanDoanTruong)
          ? await doGet(`student/getStudentInClass`, { classCode: classId, unionId })
          : await doGet(`student/getStudentInGroup`, { scholasticId, userId, classId })

      if (res && res.data.success) {
        let newList = _.orderBy(
          res.data.data?.filter(stu => stu.status !== StudentStatus.LeaveStudy && stu.status !== StudentStatus.ChangeChurch),
          ['stuGender', 'stuLastName'],
          ['asc']
        )
        newList = newList.map(stu => {
          if (stu.studentClass.some(sl => sl.unionId !== 1 && sl.class.scholasticId === Number(scholasticId)))
            return {
              id: stu.id,
              name: `${lstHolyName.find(h => h.id === stu.stuHolyId).name} ${stu.stuFirstName} ${stu.stuLastName}`
            }
          return { id: 0 }
        })

        return newList.filter(i => i.id !== 0)
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
    const { classId, scholasticId } = sessionHelper()
    const unionId = get(AbsentUnionSelected)

    try {
      const res = await doGet(`student/getStudentInClass`, { classCode: classId, unionId: unionId })

      if (res && res.data.success && res.data.data) {
        const distinctTeam = [...new Set(res.data.data.map(x => x.studentClass.find(sc => Number(sc.classId) === Number(classId)).team))]
        const lstStudent = []

        for (const t of distinctTeam) {
          if (t !== 0) lstStudent.push({ team: t, students: [] })
        }
        for (const stu of res.data.data) {
          stu.semesterOne = stu.semesterOne?.filter(sr => Number(sr.scholasticId) === Number(scholasticId))
          stu.semesterTwo = stu.semesterTwo?.filter(sr => Number(sr.scholasticId) === Number(scholasticId))
          stu.total = stu.total?.filter(sr => Number(sr.scholasticId) === Number(scholasticId))

          lstStudent.forEach(t => {
            if (t.team === stu.studentClass.find(sc => Number(sc.classId) === Number(classId)).team) {
              t.students.push(stu)
            }
          })
        }
        return _.orderBy(lstStudent, ['team'], ['asc'])
      }
    } catch (err) {
      return []
    }
  }
})

export const StudentAbsentListQuery = selectorFamily({
  key: 'StudentAbsentListQuery',
  get:
    studentId =>
      async ({ get }) => {
        const { classId, scholasticId } = sessionHelper()
        const res = await doGet(`student/absents`, { studentId, classId, scholasticId })

        if (res && res.data.success) {
          return res.data.data
        }
        return []
      }
})
