import { atom, selector } from 'recoil'

import sessionHelper from 'utils/sessionHelper'
import { doGet } from 'utils/axios'
import FileUtils from 'utils/FileUtils'

import { storageState } from 'recoils/firebase'

export const ReloadUser = atom({
  key: 'ReloadUser',
  default: 1
})

export const ShowChangePassword = atom({
  key: 'ShowChangePassword',
  default: false
})

export const OpenEditAvatar = atom({ key: 'OpenEditAvatar', default: false })

export const ReloadCoverImage = atom({
  key: 'ReloadCoverImage',
  default: 1
})

export const EditCoverImage = atom({
  key: 'EditCoverImage',
  default: false
})

export const UserQuery = selector({
  key: 'UserQuery',
  get: async ({ get }) => {
    get(ReloadUser)

    const res = await doGet(`user/getUser`, { userId: sessionHelper().userId })
    if (res && res.data.success) {
      return res.data.data
    }
  }
})

export const CoverImageQuery = selector({
  key: 'CoverImageQuery',
  get: async ({ get }) => {
    get(ReloadCoverImage)

    const storage = get(storageState)

    const { userId, coverId } = sessionHelper()

    const avatarFiles = await FileUtils.getFiles(storage, `avatars/${userId}`)
    const coverImage = avatarFiles.find(img => img.fileName === `${coverId}.png`)

    return coverImage ? coverImage.url : null
  }
})
