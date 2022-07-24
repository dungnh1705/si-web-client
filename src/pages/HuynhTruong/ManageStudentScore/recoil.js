import { atom, selector } from 'recoil'
import _ from 'lodash'
import config from 'config'
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

    try {
      var res = await doGet(`${config.ApiEndpoint}/student/getStudentInClass`, { classCode: classId, unionId: unionId })

      if (res && res.data.success && res.data.data) {
        const distinctTeam = [...new Set(res.data.data.map(x => x.studentClass.find(sc => sc.classId == classId).team))]
        const lstStudent = []

        for (const t of distinctTeam) {
          if (t !== 0) lstStudent.push({ team: t, students: [] })
        }
        for (const stu of res.data.data) {
          stu.semesterOne = stu.semesterOne?.filter(sr => sr.scholasticId == scholasticId)
          stu.semesterTwo = stu.semesterTwo?.filter(sr => sr.scholasticId == scholasticId)
          stu.total = stu.total?.filter(sr => sr.scholasticId == scholasticId)

          lstStudent.forEach(t => {
            if (t.team === stu.studentClass.find(sc => sc.classId == classId).team) {
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

export const PageYOffset = atom({
  key: 'pageYOffset',
  default: 0
})
