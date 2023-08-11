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
      case Roles.BanDieuHanh:
        res = 'Ban điều hành'
        break
      case Roles.SinhHoat:
        res = 'Sinh hoạt'
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
      case Roles.HocTap:
        res = 'Học tập'
        break
      case Roles.PhungVu:
        res = 'Phụng vụ'
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
      case Roles.BanDieuHanh:
        return Roles.BanDieuHanh

      case Roles.PhanDoanTruong:
        return Roles.PhanDoanTruong

      default:
        return Roles.HuynhTruong
    }
  },
  holyNameLookup(holynames, lookupId) {
    const res = holynames.find(h => h.id === lookupId)?.name || ''
    return res === '...' ? '' : res
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
