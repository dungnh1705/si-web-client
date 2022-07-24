import { atom, selector } from 'recoil'
import _ from 'lodash'

// utils
import config from 'config'
import { doGet } from 'utils/axios'
import sessionHelper from 'utils/sessionHelper'

// enum
import { Roles } from 'app/enums'

export const documentReview = atom({
  key: 'documentReview',
  default: undefined
})

export const reportTemplateQuery = selector({
  key: 'reportTemplateQuery',
  get: async () => {
    const userRoles = sessionHelper().roles
    const classId = sessionHelper().classId

    const res = await doGet(`${config.ApiEndpoint}/template/get`)

    if (res && res.data.success) {
      let result = []

      res.data.data.forEach(item => {
        if (item.isActive) {
          userRoles.forEach(r => {
            if (item.roleTemplate & r) {
              result.push(item)

              if (r === Roles.HuynhTruong && !classId) {
                delete result[result.length - 1]
              }
            }
          })
        }
      })
      return _.orderBy(result, ['name'], ['asc'])
    }
    return []
  }
})
