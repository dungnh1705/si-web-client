import React from 'react'
import { NavLink as RouterLink } from 'react-router-dom'
import { Grid, Button } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import svgImage3 from 'assets/images/illustrations/404.svg'

const Error404 = () => {
  return (
    <>
      <div className="app-wrapper bg-white">
        <div className="app-main">
          <Button component={RouterLink} to="/Dashboard" size="large" color="secondary" variant="contained" className="text-white btn-go-back">
            <span className="btn-wrapper--icon">
              <ArrowBackIcon />
            </span>
            <span className="btn-wrapper--label">Quay về trang chính</span>
          </Button>
          <div className="app-content p-0">
            <div className="app-inner-content-layout--main">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content">
                  <div className="hero-wrapper bg-composed-wrapper min-vh-100">
                    <div className="flex-grow-1 w-100 d-flex align-items-center">
                      <Grid item lg={6} md={9} className="px-4 px-lg-0 mx-auto text-center text-black">
                        <img src={svgImage3} className="w-50 mx-auto d-block my-5 img-fluid" alt="..." />
                        <h3 className="font-size-xxl line-height-sm font-weight-light d-block px-3 mb-3 text-black-50">Bạn đang truy cập trang không tồn tại.</h3>
                      </Grid>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Error404
