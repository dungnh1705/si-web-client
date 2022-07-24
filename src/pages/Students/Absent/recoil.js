import { atom, selector } from 'recoil'
import _ from 'lodash'
import config from 'config'
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

export const ShowConfirmDialog = atom({
  key: 'ShowConfirmDialog',
  default: false
})

export const AbsentSelected = atom({
  key: 'AbsentSelected',
  default: undefined
})

export const LoadStudentAbsent = selector({
  key: 'LoadStudentAbsent',
  get: async ({ get }) => {
    get(ReloadStudentAbsent)
    const unionCode = get(UnionCodeFilter)

    const { classId, userId, scholasticId, unionId, roles } = sessionHelper()

    try {
      var res = await doGet(`student/getAbsent`, { scholasticId: scholasticId, classCode: classId, userId: userId })
      if (res && res.data.success && res.data.data) {
        let result = []

        for (let stu of res.data.data) {
          let [year, month] = stu.dateAbsent.match(/\d+/g)

          if (
            // unionId = 0 là PĐT, unionId = 1 là Kỷ Luật
            roles.includes(Roles.PhanDoanTruong) || roles.includes(Roles.KyLuat)
              ? stu.student.studentClass.find(sc => sc.class?.scholasticId == scholasticId)?.union?.unionCode == unionCode
              : stu.student.studentClass.find(sc => sc.class?.scholasticId == scholasticId)?.union?.unionId == unionId
          ) {
            if (!result.find(re => re.year === `${month}/${year}`)) result.push({ year: `${month}/${year}`, item: [] })

            result.forEach(re => {
              if (re.year === `${month}/${year}`) re.item.push(stu)
            })
          }
        }

        // return _.orderBy(result, ['year'], ['asc'])
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
    const { classId, userId, scholasticId, unionId } = sessionHelper()
    const lstHolyName = get(HolyNameQuery)

    try {
      var res =
        Number(classId) !== 0
          ? await doGet(`student/getStudentInClass`, { classCode: classId, unionId: unionId })
          : await doGet(`student/getStudentInGroup`, { scholasticId: scholasticId, userId: userId })

      if (res && res.data.success) {
        let newList = _.orderBy(
          res.data.data?.filter(stu => stu.status !== StudentStatus.LeaveStudy && stu.status !== StudentStatus.ChangeChurch),
          ['stuGender', 'stuLastName'],
          ['asc']
        )
        newList = newList.map(stu => {
          if (stu.studentClass.some(sl => sl.unionId !== 1 && sl.class.scholasticId === Number(scholasticId)))
            return { id: stu.id, name: `${lstHolyName.find(h => h.id === stu.stuHolyId).name} ${stu.stuFirstName} ${stu.stuLastName}` }
          return { id: 0 }
        })

        return newList.filter(i => i.id !== 0)
      }
    } catch (err) {
      return null
    }
  }
})
