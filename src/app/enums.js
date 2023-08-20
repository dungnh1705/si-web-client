// Ngành
export const Branch = [
  { Id: 'CC', Name: 'Chiên Con' },
  { Id: 'Au', Name: 'Ấu nhi' },
  { Id: 'Thieu', Name: 'Thiếu nhi' },
  { Id: 'Nghia', Name: 'Nghĩa sĩ' },
  { Id: 'Hiep', Name: 'Hiệp sĩ' }
]

// Phân Đoàn
export const Group = [
  { Id: 'CC-CC', Name: 'Chiên Con' },
  { Id: 'Au-KT', Name: 'Khai tâm' },
  { Id: 'Au-RL1', Name: 'Rước lễ 1' },
  { Id: 'Au-RL2', Name: 'Rước lễ 2' },
  { Id: 'Thieu-TS1', Name: 'Thêm sức 1' },
  { Id: 'Thieu-TS2', Name: 'Thêm sức 2' },
  { Id: 'Thieu-TS3', Name: 'Thêm sức 3' },
  { Id: 'Nghia-BD1', Name: 'Bao đồng 1' },
  { Id: 'Nghia-BD2', Name: 'Bao đồng 2' },
  { Id: 'Nghia-BD3', Name: 'Bao đồng 3' },
  { Id: 'Nghia-BD4', Name: 'Bao đồng 4' },
  { Id: 'Hiep-VD1', Name: 'Vào đời 1' },
  { Id: 'Hiep-VD2', Name: 'Vào đời 2' }
]

export const UniqueCodeEnum = [
  { Id: 101, Name: 'Register' },
  { Id: 102, Name: 'Reset password' }
]

export const Roles = {
  DuTruong: 4,
  HuynhTruong: 8,
  PhanDoanTruong: 16,
  NganhTruong: 32,
  KyLuat: 64,
  SinhHoat: 128,
  PhungVu: 256,
  Admin: 2,
  HocTap: 512,
  BanDieuHanh: 1024
}

export const Functions = {
  StudentClass: 2,
  StudentScore: 3,
  StudentAbsent: 4,
  StudentSearch: 5,
  StudentGroup: 6,
  StudentOfflineRegister: 9,
  UsersAssignment: 10,
  UserRoles: 11,
  UserUnion: 12,
  UserLeader: 13,
  StudentGroupScore: 14,
  ManageForm: 15,
  DocumentDownload: 16,
  Dashboard: 100
}

export const Morality = [
  { Id: 201, Name: 'Tốt' },
  { Id: 202, Name: 'Đạt' },
  { Id: 203, Name: 'Chưa đạt' }
  // {Id: 202, Name: 'Khá'},
  // {Id: 203, Name: 'TB'},
  // {Id: 204, Name: 'Yếu'},
  // {Id: 205, Name: 'Kém'}
]

export const Semester = [
  { Id: 301, Name: 'Học kỳ I' },
  { Id: 302, Name: 'Học kỳ II' },
  { Id: 303, Name: 'Cả năm' }
]

export const SemesterEnum = {
  semesterOne: 301,
  semesterTwo: 302,
  total: 303
}

export const ViewModes = {
  DiemDanh: 0,
  XepDoi: 1,
  XepChiDoan: 2,
  DanhSachNghi: 3
}

export const AbsentMode = {
  Mass: 1,
  Class: 2
}

export const StudentStatus = {
  InActive: 0,
  Active: 1,
  LeaveStudy: 2,
  ChangeChurch: 3,
  Deleted: 4
}

export const TemplateType = {
  Document: 0,
  Report: 2,
  SystemTemplate: 4
}

export const UserStatus = {
  Absent: 0,
  NewUser: 1,
  Active: 2,
  Deleted: 3
}

export const Ranking = ['Xuất sắc', 'Giỏi', 'Khá', 'Trung bình', 'Yếu', 'Kém']

export const RegisterMode = {
  Offline: 0,
  Online: 1
}
