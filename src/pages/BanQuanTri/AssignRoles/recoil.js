import { atom, selector } from 'recoil'
import _ from 'lodash'

import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import FileUtils from 'utils/FileUtils'

import { storageState } from 'recoils/firebase'

export const ReloadUserList = atom({
  key: 'ReloadUserList',
  default: 0
})

export const UserListQuery = selector({
  key: 'UserListState',
  get: async ({ get }) => {
    get(ReloadUserList)

    const searchKey = get(SearchKey)
    const storage = get(storageState)

    var res = searchKey ? await doGet(`user/searchUsers`, { keywords: searchKey }) : await doGet(`user/getUsers`, { scholasticId: sessionHelper().scholasticId })

    const users = _.orderBy(
      res.data.data.filter(i => Number(i.id) !== Number(sessionHelper().userId)),
      ['lastName'],
      ['asc']
    )

    const avatarPromises = users.map(async user => {
      if (user.croppedAvatarId) {
        const avatars = await FileUtils.getFiles(storage, `avatars/${user.id}`)
        const userAvatar = avatars.find(img => img.fileName === `${user.croppedAvatarId}.png`)

        return { ...user, avatarUrl: userAvatar }
      }

      return user
    })
    return await Promise.all(avatarPromises)
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
