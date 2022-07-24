import React, { Fragment } from 'react'
// import { useRecoilValue } from 'recoil'
import clsx from 'clsx'

import { Header, SidebarCollapsed, ThemeConfigurator } from '../../layout-components'

// import { themeOptionsState } from 'recoils/atoms'

const CollapsedSidebar = props => {
  const { children, contentBackground } = props
  // const { sidebarToggleMobile, headerDrawerToggle, headerSearchHover } = useRecoilValue(themeOptionsState)

  return (
    <Fragment>
      <div className={clsx('app-wrapper vh-100', contentBackground)}>
        <Header isCollapsedLayout={true} />
        <div className="app-main">
          <SidebarCollapsed />
          <div className={clsx('app-content')}>
            <div className="app-inner-content-layout--main">
              <div className="app-inner-content-layout app-inner-content-layout-fixed">
                <div className="px-4 pt-2 w-100">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ThemeConfigurator />
    </Fragment>
  )
}

export default CollapsedSidebar
