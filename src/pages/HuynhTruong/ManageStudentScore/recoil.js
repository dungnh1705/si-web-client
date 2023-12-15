import { atom, selector, selectorFamily } from 'recoil'
import _ from 'lodash'
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { SemesterEnum } from 'app/enums'

export const ReloadStudentList = atom({
  key: 'ReloadStudentList',
  default: 0
})

export const StudentListQuery = selector({
  key: 'studentListState',
  get: async ({ get }) => {
    get(ReloadStudentList)
    const { classId, scholasticId, unionId } = sessionHelper()
    //

    try {
      const res = await doGet(`student/getStudentInClass`, { classCode: classId, unionId: unionId })
      if (res && res.data.success && res.data.data) {
        const distinctTeam = [...new Set(res.data.data.map(x => x.studentClass.find(sc => Number(sc.classId) === Number(classId)).team))]
        const lstStudent = []
        console.log(distinctTeam)
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
      return null
    }
  }
})

export const ShowDetail = atom({
  key: 'showDetail',
  default: []
})

export const WorkingSemester = atom({
  key: 'workingSemester',
  default: SemesterEnum.semesterOne
})

export const GetTeamsInfoSelector = selector({
  key: 'GetTeamsInfoSelector',
  get: async () => {
    const { classId, unionId } = sessionHelper()

    const res = await doGet(`class/getTeamsInUnion`, { classId, unionId })
    if (res && res.data.success) {
      const { data } = res.data
      return data
    }

    return []
  }
})

export const TeamScoreSelected = atom({
  key: 'TeamScoreSelected',
  default: []
})

export const SemesterSelected = atom({
  key: 'semesterSelected',
  default: 301
})

export const StudentScoreInUnionSelector = selector({
  key: 'StudentScoreInUnionSelector',
  get: async ({ get }) => {
    //const unionId = get(UnionScoreSelected)
    const semesterCode = get(SemesterSelected)

    const { scholasticId, classId, userId, unionId } = sessionHelper()

    const res = await doGet(`student/getScoreByUnionId`, {
      scholasticId,
      userId,
      classId,
      getAttendance: true,
      unionId,
      semesterCode
    })
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

export const UnionScoreSelected = atom({
  key: 'UnionScoreSelected',
  default: undefined
})

export const StudentScoreInTeamSelector = selectorFamily({
  key: 'StudentScoreInTeamSelector',
  get:
    studentId =>
    async ({ get }) => {
      const semesterCode = get(SemesterSelected)
      const { scholasticId } = sessionHelper()

      const res = await doGet(`student/getStudentScoreInTeam`, { scholasticId, studentId, semesterCode })
      if (res && res.data.success) {
        const { data } = res.data

        return data
      }
      return null
    }
})
