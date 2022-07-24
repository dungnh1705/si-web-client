import React from 'react'
import { renderRoutes } from 'react-router-config'

const ErrorLayoutInner = ({ route }) => {
  return <>{renderRoutes(route.routes)}</>
}

const ErrorLayout = ({ route }) => {
  return <ErrorLayoutInner route={route}></ErrorLayoutInner>
}

export default ErrorLayout
