import { atom } from 'recoil'

export const OpenAbsentDialog = atom({
  key: 'openAbsentDialog',
  default: false
})

export const StudentAbsent = atom({
  key: 'studentAbsent',
  default: undefined
})

export const RolesDialogAtom = atom({
  key: 'rolesDialog',
  default: {
    open: false,
    pageCall: undefined,
    user: undefined
  }
})

export const StudentDialogAtom = atom({
  key: 'studentDialogAtom',
  default: {
    stuDialog: false,
    pageCall: undefined,
    student: undefined
  }
})

export const PhoneCallDialogAtom = atom({
  key: 'PhoneCallDialogAtom',
  default: {
    phoneCallDialog: false,
    phoneNo: undefined
  }
})

export const ScoreDownloadDialogAtom = atom({
  key: 'scoreDownloadDialogAtom',
  default: {
    openScoreDownload: false,
    lstStudent: [],
    teamCollapse: []
  }
})

export const ChooseFileDialogAtom = atom({
  key: 'chooseFileDialogAtom',
  default: {
    openChooseFileDialog: false,
    pageCall: undefined,
    semesterId: undefined
  }
})

export const DocumentPreviewDialogAtom = atom({
  key: 'documentPreviewDialogAtom',
  default: {
    openPreviewDialog: false,
    document: undefined,
    studentId: undefined,
    templateType: undefined
  }
})
