import { atom, selector } from 'recoil'
import _ from 'lodash'
import { doGet } from 'utils/axios'

export const SearchKeyword = atom({
  key: 'SearchKeyword',
  default: ''
})

export const ReloadStuSearch = atom({
  key: 'ReloadStuSearch',
  default: 0
})

export const StudentSearchList = selector({
  key: 'StudentSearchList',
  get: async ({ get }) => {
    get(ReloadStuSearch)
    const searchKey = get(SearchKeyword)
    try {
      var res = await doGet(`student/findStudent`, { keywords: searchKey })

      if (res && res.data.success) {
        if (res.data.data) return _.orderBy(res.data.data, ['stuLastName', 'stuFirstName'], ['asc'])
        else return null
      }
    } catch (err) {
      return null
    }
  }
})

export const ShowStudent = atom({
  key: 'ShowStudent',
  default: null
})
