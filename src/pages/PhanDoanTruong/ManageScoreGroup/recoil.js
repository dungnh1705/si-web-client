import { atom, selector, selectorFamily } from 'recoil'
import _ from 'lodash'
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { UnionQuery } from 'recoils/selectors'

export const SearchGroupScore = atom({
  key: 'searchGroupScore',
  default: undefined
})

export const SemesterSelected = atom({
  key: 'semesterSelected',
  default: 301
})

export const ReloadGroupScore = atom({
  key: 'reloadGroupScore',
  default: 1
})

export const UnionScoreSelected = atom({
  key: 'UnionScoreSelected',
  default: undefined
})

export const TeamScoreSelected = atom({
  key: 'TeamScoreSelected',
  default: []
})

export const StudentScoreInUnionSelector = selector({
  key: 'StudentScoreInUnionSelector',
  get: async ({ get }) => {
    const unionId = get(UnionScoreSelected)
    const semesterCode = get(SemesterSelected)

    const { scholasticId, classId, userId } = sessionHelper()

    const res = await doGet(`student/getScoreByUnionId`, { scholasticId, userId, classId, getAttendance: true, unionId, semesterCode })
    if (res && res.data.success) {
      const { data } = res.data
      return data.reduce((group, stu) => {
        const { currentClass } = stu
        group[currentClass.team] = group[currentClass.team] ?? []
        group[currentClass.team].push(stu)

        return group
      }, {})
    }
    return null
  }
})

export const StudentScoreInTeamSelector = selectorFamily({
  key: 'StudentScoreInTeamSelector',
  get:
    studentId =>
    async ({ get }) => {
      const semesterCode = get(SemesterSelected)
      const { groupId,scholasticId } = sessionHelper()

      const res = await doGet(`student/getStudentScoreInTeam`, {groupId, scholasticId, studentId, semesterCode })
      if (res && res.data.success) {
        const { data } = res.data

        return data
      }
      return null
    }
})

export const GetUnionTeamsInfoSelector = selector({
  get: async ({ get }) => {
    const unionId = get(UnionScoreSelected)
    const { classId } = sessionHelper()

    if (unionId) {
      const res = await doGet(`class/getTeamsInUnion`, { classId, unionId })
      if (res && res.data.success) {
        const { data } = res.data
        return data
      }
    }
    return null
  }
})

export const StudentsGroupScore = selector({
  key: 'studentsGroupScore',
  get: async ({ get }) => {
    get(ReloadGroupScore)

    const userId = sessionHelper().userId
    const scholasticId = Number(sessionHelper().scholasticId)
    const classId = sessionHelper().classId

    const lstUnion = get(UnionQuery)

    var res = await doGet(`student/getStudentInGroup`, { scholasticId, userId, classId, getAttendance: true })

    if (res && res.data.success) {
      const lstStudent = []

      // Tạo mảng danh sách chi đoàn
      for (const t of lstUnion) {
        lstStudent.push({ unionId: t.unionId, unionCode: t.unionCode, students: [] })
      }
      if (res.data.data) {
        let { data } = res.data

        // Đưa từng Đoàn sinh vô chi đoàn
        for (const stu of data) {
          stu.semesterOne = stu.semesterOne?.filter(sr => sr.scholasticId === scholasticId)
          stu.semesterTwo = stu.semesterTwo?.filter(sr => sr.scholasticId === scholasticId)
          stu.total = stu.total?.filter(sr => sr.scholasticId === scholasticId)

          const stuUnionId = stu?.studentClass?.find(sc => sc.classId === stu.classId)?.unionId
          if (stuUnionId !== 1) {
            lstStudent.forEach(t => {
              if (t.unionId === stuUnionId) {
                t.students.push(stu)
              }
            })
          }
        }
        return _.orderBy(lstStudent, ['unionId'], ['asc'])
      }
    }
    return null
  }
})
