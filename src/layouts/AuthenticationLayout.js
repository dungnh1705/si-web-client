import React from 'react'
import { renderRoutes } from 'react-router-config'

const AuthenticationLayoutInner = ({ route }) => {
  return <>{renderRoutes(route.routes)}</>
}

const AuthenticationLayout = ({ route }) => {
  return <AuthenticationLayoutInner route={route}></AuthenticationLayoutInner>
}

export default AuthenticationLayout
