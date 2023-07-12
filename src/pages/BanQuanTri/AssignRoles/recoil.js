import { atom, selector } from 'recoil'

import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'

export const ReloadUserList = atom({
  key: 'ReloadUserList',
  default: 0
})

export const UserListQuery = selector({
  key: 'UserListQuery',
  get: async ({ get }) => {
    const { scholasticId, userId } = sessionHelper()

    get(ReloadUserList)

    const filter = get(UserFilterAtom)

    const res = filter
      ? await doGet(`user/search`, {
          scholasticId,
          ...filter
        })
      : await doGet(`user/getUsers`, { scholasticId })

    if (res && res.data.success) {
      return res.data.data.filter(i => Number(i.id) !== Number(userId))
    }

    return []
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

export const UserFilterAtom = atom({
  key: 'UserFilterAtom',
  default: null
})
