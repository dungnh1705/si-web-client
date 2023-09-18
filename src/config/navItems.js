import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined'

import DashboardTwoToneIcon from '@material-ui/icons/DashboardTwoTone'
// import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'
import PeopleAltTwoToneIcon from '@material-ui/icons/PeopleAltTwoTone'
import StarTwoToneIcon from '@material-ui/icons/StarTwoTone'
import CheckTwoToneIcon from '@material-ui/icons/CheckTwoTone'
import AssignmentIndTwoToneIcon from '@material-ui/icons/AssignmentIndTwoTone'
import PersonAddTwoToneIcon from '@material-ui/icons/PersonAddTwoTone'
// import SupervisorAccountTwoToneIcon from '@material-ui/icons/SupervisorAccountTwoTone'
import AssignmentTurnedInTwoToneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone'
import LayersTwoToneIcon from '@material-ui/icons/LayersTwoTone'
import ImportContactsTwoToneIcon from '@material-ui/icons/ImportContactsTwoTone'
import PollTwoToneIcon from '@material-ui/icons/PollTwoTone'

import { Roles } from 'app/enums'
import sessionHelper from 'utils/sessionHelper'
import { Download, DownloadCloud } from 'react-feather'

const functions = [
  { label: 'Thông tin chung', icon: DashboardTwoToneIcon, to: '/Dashboard' },
  { label: 'Xem báo cáo', icon: PollTwoToneIcon, to: '/Report' },
  { label: 'Tải biểu mẫu', role: Roles.PhanDoanTruong, icon: Download, to: '/Form' },
  { label: 'Tải biểu mẫu', role: Roles.HuynhTruong, icon: Download, to: '/Form' },
  { label: 'Tải biểu mẫu', role: Roles.DuTruong, icon: Download, to: '/Form' },
  {
    role: Roles.BanDieuHanh,
    label: 'Ban điều hành',
    icon: BarChartOutlinedIcon,
    content: [
      {
        label: 'Thông tin Phân đoàn',
        icon: DashboardTwoToneIcon,
        description: 'Xem thông tin chi tiết của từng Phân đoàn',
        to: '/BQT/GroupInfo'
      },
      {
        label: 'Thêm Đoàn sinh mới',
        icon: PersonAddTwoToneIcon,
        description: 'Thêm mới Đoàn sinh',
        to: '/BQT/RegisterOffline'
      },
      {
        label: 'Danh sách HT|DT',
        icon: LayersTwoToneIcon,
        description: 'Phân chức vụ cho Huynh trưởng',
        to: '/BQT/AssignUserRoles'
      },
      {
        label: 'Phân công tác HT',
        icon: AssignmentTurnedInTwoToneIcon,
        description: 'Phân công tác cho Huynh trưởng',
        to: '/BQT/TeacherAssignment'
      },
      {
        label: 'Quản lý biểu mẫu',
        icon: ImportContactsTwoToneIcon,
        description: 'Quản lý biểu mẫu hệ thống',
        to: '/BQT/ManageForms'
      }
    ]
  },
  {
    role: Roles.PhanDoanTruong,
    label: 'Phân đoàn trưởng',
    icon: BarChartOutlinedIcon,
    content: [
      {
        label: 'Phân công Chi đoàn',
        icon: AssignmentIndTwoToneIcon,
        description: 'Phân công tác chi đoàn cho Huynh trưởng',
        to: '/PDT/AssignUserUnion'
      },
      {
        label: 'Thêm Đoàn sinh mới',
        icon: PersonAddTwoToneIcon,
        description: 'Thêm mới Đoàn sinh',
        to: '/PDT/AddNewStudent'
      },
      {
        label: 'Phân đoàn của tôi',
        icon: PeopleAltTwoToneIcon,
        description: 'Danh sách Đoàn sinh trong Phân đoàn',
        to: '/PDT/StudentGroup'
      },
      {
        label: 'Chuyển chi đoàn',
        icon: PeopleAltTwoToneIcon,
        description: 'Chuyển Chi đoàn cho Đoàn sinh trong Phân Đoàn',
        to: '/PDT/ChangeStudentUnion'
      },
      {
        label: 'Nhập điểm',
        icon: StarTwoToneIcon,
        description: 'Danh sách điểm Phân đoàn',
        to: '/PDT/StudentGroupScore'
      },
      {
        label: 'Điểm danh',
        icon: CheckTwoToneIcon,
        description: 'Điểm danh Đoàn sinh vắng',
        to: '/PDT/GroupAbsent'
      }
    ]
  },
  {
    role: Roles.HuynhTruong,
    label: 'Huynh trưởng',
    icon: BarChartOutlinedIcon,
    content: [
      {
        label: 'Chi đoàn của tôi',
        icon: PeopleAltTwoToneIcon,
        description: 'Danh sách Đoàn sinh trong Chi đoàn',
        to: '/HT/StudentClass'
      },
      {
        label: 'Nhập điểm',
        icon: StarTwoToneIcon,
        description: 'Danh sách điểm Chi đoàn',
        to: '/HT/StudentScore'
      },
      {
        label: 'Điểm danh',
        icon: CheckTwoToneIcon,
        description: 'Điểm danh Đoàn sinh vắng',
        to: '/HT/ClassAbsent'
      }
    ]
  },
  {
    role: Roles.DuTruong,
    label: 'Dự trưởng',
    icon: BarChartOutlinedIcon,
    content: [
      {
        label: 'Chi đoàn của tôi',
        icon: PeopleAltTwoToneIcon,
        description: 'Danh sách Đoàn sinh trong Chi đoàn',
        to: '/HT/StudentClass'
      },
      {
        label: 'Nhập điểm',
        icon: StarTwoToneIcon,
        description: 'Danh sách điểm Chi đoàn',
        to: '/HT/StudentScore'
      },
      {
        label: 'Điểm danh',
        icon: CheckTwoToneIcon,
        description: 'Điểm danh Đoàn sinh vắng',
        to: '/HT/ClassAbsent'
      }
    ]
  }
]

// Từ danh sách functions
// Kiểm tra danh sách Roles của User login
// If User có role được config trong function thì kiếm tra thêm nếu function đó là dành cho Huynh Trưởng mà User login không có thông tin Class (chứng tỏ user login là PDT) thì sẽ không hiện function đó
// ngoài các function có Role thì cũng lấy các functions không có role

// Trường hợp user login không có roles trong function thì kiểm tra function của Phân Đoàn Trưởng nếu có role Học Tập thì hiện chức năng của Phân Đoàn Trưởng

export default [
  {
    label: 'Danh sách chức năng',
    content: sessionHelper().isFirstLogin
      ? []
      : functions.filter(func => {
        return (
          (sessionHelper().roles?.includes(func.role)
            ? func.role === Roles.HuynhTruong || func.role === Roles.DuTruong
              ? sessionHelper().roles?.includes(Roles.PhanDoanTruong) && sessionHelper().unionId === 0
                ? false
                : sessionHelper().classId && sessionHelper().unionId !== 1
                  ? true
                  : false
              : true
            : func.role === Roles.PhanDoanTruong && sessionHelper().roles?.includes(Roles.HocTap)
              ? true
              : false) || !func.role
        )
      })
  }
]
