import { atom, atomFamily } from 'recoil'
import { ViewModes } from 'app/enums'

export const themeOptionsState = atom({
  key: 'themeOptionsState',
  default: {
    // Sidebar
    sidebarShadow: false,
    sidebarFixed: true,
    sidebarToggleMobile: false,
    sidebarFooter: false,
    sidebarUserbox: false,
    sidebarToggle: false,
    sidebarHover: false,

    // Header
    headerFixed: true,
    headerShadow: false,
    headerSearchHover: false,

    // Main content
    contentBackground: '',
    themeConfiguratorToggle: false,

    // Footer
    footerFixed: false,
    footerShadow: false,

    // Page title
    pageTitleStyle: '',
    pageTitleBackground: '',
    pageTitleShadow: false,
    pageTitleBreadcrumb: true,
    pageTitleIconBox: false,
    pageTitleDescription: false,

    layoutStyle: 1,
    headerColor: '#6b73ff'
  }
})

// export const primaryColor = atom({
//   key: 'primaryColor',
//   default: localStorage.getItem('si_primaryColor') || '#6b73ff'
// })

export const themeColor = atom({
  key: 'themeColor',
  default: {
    primary: localStorage.getItem('si_primaryColor') || '#6b73ff',
    secondary: localStorage.getItem('si_secondaryColor') || '#6b73ff'
  }
})

export const forceCheckingAuth = atom({
  key: 'forceCheckingAuth',
  default: 0
})

export const forceReloadNav = atom({
  key: 'forceReloadNav',
  default: false
})

export const loadingState = atom({
  key: 'loadingState',
  default: false
})

export const toastState = atom({
  key: 'toastState',
  default: {
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
    title: '',
    type: 'success' //success | warning | infor | error
  }
})

export const reloadHolyName = atom({
  key: 'reloadHolyName',
  default: 0
})

export const reloadTemplates = atom({
  key: 'reloadTemplates',
  default: 0
})

export const ViewMode = atom({
  key: 'viewMode',
  default: ViewModes.DiemDanh
})

export const PageYOffset = atom({
  key: 'pageYOffset',
  default: 0
})

export const reloadListUnion = atom({
  key: 'reloadListUnion',
  default: 0
})

export const reloadUserAvatar = atom({
  key: 'reloadUserAvatar',
  default: 0
})

export const ShowChangePassword = atom({
  key: 'ShowChangePassword',
  default: false
})

export const UserImageAtom = atom({
  key: 'UserImageAtom',
  default: undefined
})
