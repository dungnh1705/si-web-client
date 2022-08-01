import { atom, selector } from 'recoil'
import _ from 'lodash'
import slugify from 'slugify'

import { doGet } from 'utils/axios'

export const NewStudentSearchKey = atom({
  key: 'NewStudentSearchKey',
  default: undefined
})

export const ReloadNewStudent = atom({
  key: 'ReloadNewStudent',
  default: 0
})

export const NewStudentSelected = atom({
  key: 'NewStudentSelected',
  default: undefined
})

export const IsEditNewStu = atom({
  key: 'IsEditNewStu',
  default: false
})

export const NewStudentQuery = selector({
  key: 'NewStudentQuery',
  get: async ({ get }) => {
    get(ReloadNewStudent)
    const filter = get(NewStudentSearchKey)

    var res = await doGet(`student/getNewStudent`)

    if (res && res.data.success) {
      let result = null

      if (filter) {
        let keys = slugify(filter, { lower: true })
        result = _.filter(res.data.data, item => slugify(`${item.stuFirstName}-${item.stuLastName}`, { lower: true }).includes(keys))
      } else {
        result = res.data.data
      }

      return _.chain(_.orderBy(result, ['stuLastName'], ['asc']))
        .groupBy('registerMode')
        .map((value, key) => ({ mode: key, students: value }))
        .value()
    }

    return null
  }
})
