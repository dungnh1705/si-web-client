import React, { lazy, Suspense } from 'react'
import { Redirect } from 'react-router-dom'

//import master pages
import ErrorLayout from 'layouts/ErrorLayout'
import AuthenticationLayout from 'layouts/AuthenticationLayout'
import { CombinedLayout } from 'layouts/layout-blueprints'

//components
import PageSkeleton from 'components/Loading/page-skeleton'
// BQT
import RegisterOffline from 'pages/BanQuanTri/RegisterOffline'
// PDT
import AddNewStudent from 'pages/PhanDoanTruong/AddNewStudent'
import ManageScoreGroup from 'pages/PhanDoanTruong/ManageScoreGroup'
import { default as StudentGroup } from 'pages/PhanDoanTruong/ManageStudentsGroup'
//HT
import ManageStudentScore from 'pages/HuynhTruong/ManageStudentScore'
import { default as StudentAbsent } from 'pages/Students/Absent'
import { default as StudentClass } from 'pages/HuynhTruong/ManageStudentClass'

export default [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/Dashboard" />
  },
  {
    path: ['/Login', '/ResetPassword', '/VerifyNewUser'],
    component: AuthenticationLayout,
    routes: [
      {
        path: '/login',
        exact: true,
        component: lazy(() => import('pages/Authentication/Login'))
      },
      {
        path: '/VerifyNewUser/:email',
        exact: true,
        component: lazy(() => import('pages/Authentication/VerifyNewUser'))
      },
      {
        path: '/ResetPassword/:token',
        exact: true,
        component: lazy(() => import('pages/Authentication/ResetPassword'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    path: ['/errors'],
    component: ErrorLayout,
    routes: [
      {
        path: '/errors/error-404',
        exact: true,
        component: lazy(() => import('pages/Error/Error404'))
      },
      {
        path: '/errors/error-500',
        exact: true,
        component: lazy(() => import('pages/Error/Error500'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    path: ['/Dashboard', '/MyProfile', '/FindStudent', '/Report', '/BQT', '/PDT', '/HT'],
    component: CombinedLayout,
    routes: [
      {
        path: '/Dashboard',
        exact: true,
        component: lazy(() => import('pages/Dashboard'))
      },
      {
        path: '/MyProfile',
        exact: true,
        component: lazy(() => import('pages/Users/MyProfile'))
      },
      {
        path: '/FindStudent',
        exact: true,
        component: lazy(() => import('pages/Students/FindStudent'))
      },
      {
        path: '/Report',
        exact: true,
        component: lazy(() => import('pages/Report'))
      },
      // Ban Quản trị
      {
        path: '/BQT/RegisterOffline',
        exact: true,
        component: () => (
          <Suspense fallback={<PageSkeleton />}>
            <RegisterOffline />
          </Suspense>
        )
      },
      {
        path: '/BQT/AssignLeader',
        exact: true,
        component: lazy(() => import('pages/BanQuanTri/AssignLeader'))
      },
      {
        path: '/BQT/AssignUserClass',
        exact: true,
        component: lazy(() => import('pages/BanQuanTri/Assignment'))
      },
      {
        path: '/BQT/AssignUserRoles',
        exact: true,
        component: lazy(() => import('pages/BanQuanTri/AssignRoles'))
      },
      {
        path: '/BQT/ManageForms',
        exact: true,
        component: lazy(() => import('pages/BanQuanTri/ManageForms'))
      },
      // Phân đoàn trưởng
      {
        path: '/PDT/StudentGroup',
        exact: true,
        component: () => (
          <Suspense fallback={<PageSkeleton />}>
            <StudentGroup />
          </Suspense>
        )
      },
      {
        path: '/PDT/StudentGroupScore',
        exact: true,
        component: () => (
          <Suspense fallback={<PageSkeleton />}>
            <ManageScoreGroup />
          </Suspense>
        )
      },
      {
        path: '/PDT/AssignUserUnion',
        exact: true,
        component: lazy(() => import('pages/PhanDoanTruong/AssignUserUnion'))
      },
      {
        path: '/PDT/AssignUserUnion',
        exact: true,
        component: lazy(() => import('pages/PhanDoanTruong/AssignUserUnion'))
      },
      {
        path: '/PDT/GroupAbsent',
        exact: true,
        component: () => (
          <Suspense fallback={<PageSkeleton />}>
            <StudentAbsent />
          </Suspense>
        )
      },
      {
        path: '/PDT/AddNewStudent',
        exact: true,
        component: () => (
          <Suspense fallback={<PageSkeleton />}>
            <AddNewStudent />
          </Suspense>
        )
      },
      // Huynh trưởng
      {
        path: '/HT/StudentClass',
        exact: true,
        component: () => (
          <Suspense fallback={<PageSkeleton />}>
            <StudentClass />
          </Suspense>
        )
      },
      {
        path: '/HT/StudentScore',
        exact: true,
        component: () => (
          <Suspense fallback={<PageSkeleton />}>
            <ManageStudentScore />
          </Suspense>
        )
      },
      {
        path: '/HT/ClassAbsent',
        exact: true,
        component: () => (
          <Suspense fallback={<PageSkeleton />}>
            <StudentAbsent />
          </Suspense>
        )
      },
      // Error page
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  }
]
