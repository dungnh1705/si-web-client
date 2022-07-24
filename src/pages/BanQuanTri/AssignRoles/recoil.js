import { atom, selector } from 'recoil'
import _ from 'lodash'
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'

export const ReloadUserList = atom({
  key: 'ReloadUserList',
  default: 0
})

// export const FilterUserByStatus = atom({
//   key: 'FilterUserByStatus',
//   default: 2
// })

export const UserListQuery = selector({
  key: 'UserListState',
  get: async ({ get }) => {
    get(ReloadUserList)
    const searchKey = get(SearchKey)

    var res = searchKey ? await doGet(`user/searchUsers`, { keywords: searchKey }) : await doGet(`user/getUsers`, { scholasticId: sessionHelper().scholasticId })

    return _.orderBy(
      res.data.data.filter(i => Number(i.id) !== Number(sessionHelper().userId)),
      ['lastName'],
      ['asc']
    )
  }
})

export const ShowingUserForm = atom({
  key: 'ShowingUserForm',
  default: false
})

export const UserFormMode = atom({
  key: 'UserFormMode',
  default: 'New'
})

export const EditingUser = atom({
  key: 'EditingUser',
  default: null
})

export const SearchKey = atom({
  key: 'SearchKey',
  default: null
})
