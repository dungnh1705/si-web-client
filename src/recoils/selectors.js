import { selector, selectorFamily } from 'recoil'
import _ from 'lodash'

import { Roles } from 'app/enums'
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'
import FileUtils from 'utils/FileUtils'

import { storageState } from 'recoils/firebase'

import { themeOptionsState, reloadTemplates, reloadListUnion, reloadUserAvatar, UserImageAtom, reloadHolyName } from './atoms'

export const themeOptionsActions = selector({
  key: 'themeOptionsActions',
  set: ({ set, get }, action) => {
    const themeOptions = get(themeOptionsState)
    set(themeOptionsState, { ...themeOptions, [action.name]: action.value })
  }
})

export const HolyNameQuery = selector({
  key: 'HolyNameQuery',
  get: async ({ get }) => {
    get(reloadHolyName)

    const res = await doGet(`holyname/getall`)

    if (res && res.data && res.data.success) return _.orderBy(res.data.data, ['name'], ['asc'])
    else return []
  }
})

export const BranchQuery = selector({
  key: 'BranchQuery',
  get: async () => {
    let res = await doGet(`class/getBranch`)

    if (res && res.data.success) return _.orderBy(res.data.data, ['branchOrder'], ['asc'])
    else return []
  }
})

export const GroupQuery = selector({
  key: 'GroupQuery',
  get: async () => {
    let res = await doGet(`class/getGroup`)

    if (res && res.data.success) return res.data.data
    else return []
  }
})

export const UnionQuery = selector({
  key: 'UnionQuery',
  get: async () => {
    const userId = sessionHelper().userId
    const scholasticId = sessionHelper().scholasticId

    let res = await doGet(`assignment/getListUnionInGroup`, { scholasticId: scholasticId, userId: userId })

    if (res && res.data.success) {
      return _.orderBy(res.data.data, ['unionCode'], ['asc'])
    }
    return []
  }
})

export const UnionRegisterQuery = selectorFamily({
  key: 'UnionRegisterQuery',
  get:
    groupId =>
    async ({ get }) => {
      get(reloadListUnion)
      const res = await doGet(`assignment/getUnionByGroupId`, { groupId })

      if (res && res.data.success) {
        return _.orderBy(res.data.data, ['unionCode'], ['asc'])
      }
      return []
    }
})

export const TemplatesQuery = selector({
  key: 'TemplatesQuery',
  get: async ({ get }) => {
    get(reloadTemplates)

    const userRoles = sessionHelper().roles
    const res = await doGet(`template/get`)

    if (res && res.data.success) {
      const result = []
      const { data } = res.data

      if (userRoles.includes(Roles.BanDieuHanh)) return data

      data.forEach(item => {
        userRoles.forEach(role => {
          if (item.roleTemplate & role) result.push(item)
        })
      })

      return _.orderBy(result, ['name'], ['asc'])
    }
    return []
  }
})

export const UserAvatarQuery = selector({
  key: 'GetUserAvatar',
  get: async ({ get }) => {
    get(reloadUserAvatar)

    const storage = get(storageState)

    const { userId, croppedAvatarId, avatarId } = sessionHelper()

    const avatarFiles = await FileUtils.getFiles(storage, `avatars/${userId}`)

    const userAvatar = avatarFiles.find(img => img.fileName === `${croppedAvatarId}.png`)
    const previewAvatar = avatarFiles.find(img => img.fileName === `${avatarId}.png`)

    return {
      avatarUrl: userAvatar ? userAvatar.url : null,
      previewUrl: previewAvatar ? previewAvatar.url : null
    }
  }
})

export const UserImageSelector = selector({
  key: 'UserImageSelector',
  get: async ({ get }) => {
    const userInfo = get(UserImageAtom)
    if (userInfo && userInfo.id && userInfo.croppedAvatarId) {
      const storage = get(storageState)

      const avatarFiles = await FileUtils.getFiles(storage, `avatars/${userInfo.id}`)
      const userAvatar = avatarFiles.find(img => img.fileName === `${userInfo.croppedAvatarId}.png`)

      return userAvatar?.url ?? ''
    }
    return ''
  }
})

export const GroupSettingsQuery = selector({
  key: 'GroupSettingsQuery',
  get: async () => {
    const { groupId } = sessionHelper()
    if (!groupId) return undefined

    const res = await doGet('setting/getGroupSettings', { groupId })
    if (res && res.data.success) return res.data.data
  }
})

export const CurrentSemesterQuery = selector({
  key: 'CurrentSemesterQuery',
  get: async () => {
    const { scholasticId } = sessionHelper()
    if (!scholasticId) return undefined

    const res = await doGet('scores/current-semester', { scholasticId })
    if (res && res.data.success) return res.data.data
  }
})

export const NotificationPermissionSelector = selector({
  key: 'NotificationPermissionSelector',
  get: async () => {
    const permission = (await Notification.permission) ?? ''
    return `${permission}`
  }
})
