import { Roles } from 'app/enums'
import _ from 'lodash'

export default {
  capitalize(val) {
    if (typeof val !== 'string') return ''
    return val
      .toString()
      .split(' ')
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
  },
  buildRoleName(roleId) {
    let res = ''
    switch (Number(roleId)) {
      case Roles.Admin:
        res = 'Admin'
        break
      case Roles.BanQuanTri:
        res = 'Ban quản trị'
        break
      case Roles.PhongTrao:
        res = 'Phong trào'
        break
      case Roles.KyLuat:
        res = 'Kỷ luật'
        break
      case Roles.NganhTruong:
        res = 'Ngành trưởng'
        break
      case Roles.PhanDoanTruong:
        res = 'Phân đoàn trưởng'
        break
      case Roles.HuynhTruong:
        res = 'Huynh trưởng'
        break
      case Roles.DuTruong:
        res = 'Dự trưởng'
        break
      default:
        res = ''
        break
    }

    return res
  },
  getMaxRole(roles = []) {
    const role = _.max(roles)
    switch (role) {
      case Roles.BanQuanTri:
        return Roles.BanQuanTri

      case Roles.PhanDoanTruong:
        return Roles.PhanDoanTruong

      default:
        return Roles.HuynhTruong
    }
  },
  holyNameLookup(holynames, lookupId) {
    return holynames.find(h => h.id === lookupId)?.name || ''
  },
  toString(o) {
    let newObject = { ...o }

    Object.keys(newObject).forEach(k => {
      if (typeof newObject[k] === 'number') {
        newObject[k] = '' + newObject[k]
      }
    })

    return newObject
  }
}
