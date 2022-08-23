import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined'

import DashboardTwoToneIcon from '@material-ui/icons/DashboardTwoTone'
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone'
import PeopleAltTwoToneIcon from '@material-ui/icons/PeopleAltTwoTone'
import StarTwoToneIcon from '@material-ui/icons/StarTwoTone'
import CheckTwoToneIcon from '@material-ui/icons/CheckTwoTone'
import AssignmentIndTwoToneIcon from '@material-ui/icons/AssignmentIndTwoTone'
import PersonAddTwoToneIcon from '@material-ui/icons/PersonAddTwoTone'
import SupervisorAccountTwoToneIcon from '@material-ui/icons/SupervisorAccountTwoTone'
import AssignmentTurnedInTwoToneIcon from '@material-ui/icons/AssignmentTurnedInTwoTone'
import LayersTwoToneIcon from '@material-ui/icons/LayersTwoTone'
import ImportContactsTwoToneIcon from '@material-ui/icons/ImportContactsTwoTone'
import PollTwoToneIcon from '@material-ui/icons/PollTwoTone'

import { Roles } from 'app/enums'
import sessionHelper from 'utils/sessionHelper'

const functions = [
  { label: 'Thông tin chung', icon: DashboardTwoToneIcon, to: '/Dashboard' },
  { label: 'Tìm kiếm Đoàn sinh', icon: SearchTwoToneIcon, to: '/FindStudent' },
  { label: 'Xem báo cáo', icon: PollTwoToneIcon, to: '/Report' },
  {
    role: Roles.BanQuanTri,
    label: 'Ban quản trị',
    icon: BarChartOutlinedIcon,
    content: [
      {
        label: 'Thêm Đoàn sinh',
        icon: PersonAddTwoToneIcon,
        description: 'Thêm mới Đoàn sinh',
        to: '/BQT/RegisterOffline'
      },
      {
        label: 'Bổ nhiệm PĐT',
        icon: SupervisorAccountTwoToneIcon,
        description: 'Bổ nhiệm Phân đoàn trưởng',
        to: '/BQT/AssignLeader'
      },
      {
        label: 'Phân công tác HT',
        icon: AssignmentTurnedInTwoToneIcon,
        description: 'Phân công tác cho Huynh trưởng',
        to: '/BQT/AssignUserClass'
      },
      {
        label: 'Phân quyền',
        icon: LayersTwoToneIcon,
        description: 'Phân chức vụ cho Huynh trưởng',
        to: '/BQT/AssignUserRoles'
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
        label: 'Danh sách Phân đoàn',
        icon: PeopleAltTwoToneIcon,
        description: 'Danh sách Đoàn sinh trong Phân đoàn',
        to: '/PDT/StudentGroup'
      },
      {
        label: 'Chuyển Chi đoàn',
        icon: PeopleAltTwoToneIcon,
        description: 'Chuyển Chi đoàn cho Đoàn sinh trong Phân Đoàn',
        to: '/PDT/ChangeStudentUnion'
      },
      {
        label: 'Điểm Phân đoàn',
        icon: StarTwoToneIcon,
        description: 'Danh sách điểm Phân đoàn',
        to: '/PDT/StudentGroupScore'
      },
      {
        label: 'Danh sách nghỉ',
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
        label: 'Danh sách Chi đoàn',
        icon: PeopleAltTwoToneIcon,
        description: 'Danh sách Đoàn sinh trong Chi đoàn',
        to: '/HT/StudentClass'
      },
      {
        label: 'Điểm Chi đoàn',
        icon: StarTwoToneIcon,
        description: 'Danh sách điểm Chi đoàn',
        to: '/HT/StudentScore'
      },
      {
        label: 'Danh sách nghỉ',
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
        label: 'Danh sách chi đoàn',
        icon: PeopleAltTwoToneIcon,
        description: 'Danh sách Đoàn sinh trong Chi đoàn',
        to: '/HT/StudentClass'
      },
      {
        label: 'Điểm chi đoàn',
        icon: StarTwoToneIcon,
        description: 'Danh sách điểm Chi đoàn',
        to: '/HT/StudentScore'
      },
      {
        label: 'Danh sách nghỉ',
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
              ? func.role === Roles.HuynhTruong
                ? sessionHelper().classId
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
