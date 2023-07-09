import { atom, selector } from 'recoil'

import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'

export const ReloadUserList = atom({
  key: 'ReloadUserList',
  default: 0
})

export const UserListQuery = selector({
  key: 'UserListState',
  get: async ({ get }) => {
    get(ReloadUserList)

    const searchKey = get(SearchKey)

    const res = searchKey
      ? await doGet(`user/searchUsers`, {
          scholasticId: sessionHelper().scholasticId,
          keywords: searchKey
        })
      : await doGet(`user/getUsers`, { scholasticId: sessionHelper().scholasticId })

    return res.data.data.filter(i => Number(i.id) !== Number(sessionHelper().userId))
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
