import React, { Fragment } from 'react'
import { Popover, Button, Tooltip } from '@material-ui/core'

export default function PromoSection() {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const openPopover = event => {
    setAnchorEl(event.currentTarget)
  }

  const closePopover = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'social-share-popover' : undefined

  return (
    <Fragment>
      <div className="promo-section-wrapper">
        <div className="promo-section-buttons-wrapper">
          <div className="promo-section-buttons">
            <Tooltip arrow title="Stay up to date" placement="left">
              <Button size='large' onClick={openPopover} className="bg-neutral-first text-first p-0 d-50 d-flex align-items-center justify-content-center"></Button>
            </Tooltip>
            <Tooltip arrow title="View documentation" placement="left">
              <Button
                size='large'
                className="bg-neutral-danger text-danger my-2 p-0 d-50 d-flex align-items-center justify-content-center"
                href="https://docs.uifort.com/carolina-react-admin-dashboard-pro-docs"
                rel="noopener"
                target="_blank"></Button>
            </Tooltip>
            <Tooltip arrow title="View product details" placement="left">
              <Button
                size='large'
                className="bg-neutral-success text-success p-0 d-50 d-flex align-items-center justify-content-center"
                href="https://themes.material-ui.com/themes/carolina-react-admin-dashboard-pro"
                rel="noopener"
                target="_blank"></Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        onClose={closePopover}>
        <div className="py-3 popover-share-box popover-custom-wrapper popover-custom-xl">
          <div className="px-5 font-size-lg pb-3 text-center pt-1 font-weight-bold">Subscribe to stay up to date with our latest releases and updates!</div>
          <div className="text-center">
            <Tooltip arrow title="Facebook">
              <Button size='large' className="m-2 d-40 p-0 rounded-sm text-facebook" variant="outlined" href="https:&#x2F;&#x2F;www.facebook.com&#x2F;UiFort" rel="noopener nofollow" target="_blank">
                <span className="btn-wrapper--icon"></span>
              </Button>
            </Tooltip>
            <Tooltip arrow title="Twitter">
              <Button size='large' className="m-2 d-40 p-0 rounded-sm text-twitter" variant="outlined" href="https:&#x2F;&#x2F;twitter.com&#x2F;uifort1" rel="noopener nofollow" target="_blank">
                <span className="btn-wrapper--icon"></span>
              </Button>
            </Tooltip>
            <Tooltip arrow title="Instagram">
              <Button size='large' className="m-2 d-40 p-0 rounded-sm text-instagram" variant="outlined" href="https:&#x2F;&#x2F;www.instagram.com&#x2F;uifort1" rel="noopener nofollow" target="_blank">
                <span className="btn-wrapper--icon"></span>
              </Button>
            </Tooltip>
            <Tooltip arrow title="Discord">
              <Button size='large' className="m-2 d-40 p-0 rounded-sm text-first" variant="outlined" href="https:&#x2F;&#x2F;discord.gg&#x2F;mddFBQX" rel="noopener nofollow" target="_blank">
                <span className="btn-wrapper--icon"></span>
              </Button>
            </Tooltip>
            <Tooltip arrow title="Dribbble">
              <Button size='large' className="m-2 d-40 p-0 rounded-sm text-dribbble" variant="outlined" href="https:&#x2F;&#x2F;dribbble.com&#x2F;UiFort" rel="noopener nofollow" target="_blank">
                <span className="btn-wrapper--icon"></span>
              </Button>
            </Tooltip>
            <Tooltip arrow title="Github">
              <Button
                size='large'
                className="m-2 d-40 p-0 rounded-sm text-github border-github"
                variant="outlined"
                color="default"
                href="https:&#x2F;&#x2F;github.com&#x2F;uifort"
                rel="noopener nofollow"
                target="_blank">
                <span className="btn-wrapper--icon"></span>
              </Button>
            </Tooltip>
          </div>
          <div className="divider my-3" />
          <div className="text-center">
            <Button
              size='large'
              variant="contained"
              className="px-4"
              color="primary"
              href="https://uifort.com"
              rel="noopener"
              target="_blank"
              title="Powerful admin dashboard templates & ui kits that are easy to use and customize.">
              <span className="btn-wrapper--label">Visit UiFort.com</span>
              <span className="btn-wrapper--icon"></span>
            </Button>
          </div>
        </div>
      </Popover>
    </Fragment>
  )
}
