import React, { Fragment } from 'react'
import { Grid, Button, Icon } from '@material-ui/core'
import svgImage7 from 'assets/images/illustrations/500.svg'
import { NavLink as RouterLink } from 'react-router-dom'

const Error500 = () => {
  return (
    <Fragment>
      <div className="app-wrapper bg-light">
        <div className="app-main">
          <div className="app-content p-0">
            <div className="app-inner-content-layout--main">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content">
                  <div className="hero-wrapper bg-composed-wrapper min-vh-100">
                    <div className="flex-grow-1 w-100 d-flex align-items-center">
                      <Grid item lg={6} md={9} className="px-4 mx-auto text-center text-black">
                        <img src={svgImage7} className="w-50 mx-auto d-block my-5 img-fluid" alt="..." />

                        <h1 className="display-1 mb-3 px-4 font-weight-bold">500 Internal Server Error</h1>
                        <h3 className="font-size-xxl line-height-sm font-weight-light d-block px-3 mb-3 text-black-50">There was an error, please try again later.</h3>
                        <p>The server encountered an internal server error and was unable to complete your request.</p>
                        <Button component={RouterLink} to="/login" size="large" color="primary" variant="contained" className="text-white mt-4">
                          <span className="btn-wrapper--icon">
                            <Icon className="fas fa-arrow-left" />
                          </span>
                          <span className="btn-wrapper--label">Back to login page</span>
                        </Button>
                      </Grid>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Error500
