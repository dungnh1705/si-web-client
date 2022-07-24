import { atom, selector } from 'recoil'
import _ from 'lodash'
import config from 'config'
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import { UnionQuery } from 'recoils/selectors'
// import slugify from 'slugify'

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

export const StudentsGroupScore = selector({
  key: 'studentsGroupScore',
  get: async ({ get }) => {
    get(ReloadGroupScore)
    // const searchKey = get(SearchGroupScore)
    const userId = sessionHelper().userId
    const scholasticId = Number(sessionHelper().scholasticId)

    const lstUnion = get(UnionQuery)

    var res = await doGet(`${config.ApiEndpoint}/student/getStudentInGroup`, { scholasticId: scholasticId, userId: userId, getAttendance: true })

    if (res && res.data.success) {
      // const distinctUnion = [...new Set(res.result.map(x => x.studentClass.find(sc => sc.classId === x.classId).unionId))]
      const lstStudent = []

      // Tạo mảng danh sách chi đoàn
      for (const t of lstUnion) {
        lstStudent.push({ unionId: t.unionId, unionCode: t.unionCode, students: [] })
      }
      if (res.data.data) {
        let { data } = res.data

        // if (searchKey) {
        //   let keys = slugify(searchKey, { lower: true })
        //   data = data.filter(stu => slugify(`${stu.stuFirstName}-${stu.stuLastName}`, { lower: true }).includes(keys))
        // }

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
