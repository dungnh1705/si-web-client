import React, { useState, useEffect } from 'react'
import { CardContent, Modal, Grid, Divider, IconButton, Tooltip } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import CardOnModal from 'components/CardOnModal'

import { doGet } from 'utils/axios'
import noImage from 'assets/images/no_image.jpg'

const ShowImageModal = ({ imageId, open, handleClose }) => {
  let [base64, setBase64] = useState(null)

  useEffect(() => {
    async function fetchData() {
      let res = await doGet(`image/base64image`, { id: imageId })
      if (res && res.data.success) setBase64(res.data.data)
    }

    if (imageId !== null) fetchData()
  }, [imageId])

  return (
    <Modal open={open} onClose={handleClose} className="uw-modal">
      <CardOnModal>
        <div className="card-header d-flex pb-1 pt-1">
          <Grid container item justifyContent="flex-end">
            <div className="card-header--actions">
              <Tooltip title="Đóng">
                <IconButton size='medium' onClick={handleClose}>
                  <FontAwesomeIcon icon={faTimes} />
                </IconButton>
              </Tooltip>
            </div>
          </Grid>
        </div>

        <Divider />
        <CardContent>
          <Grid spacing={3} container justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              <img src={base64 ?? noImage} alt="preview" width="100%" height="100%" />
            </Grid>
          </Grid>
        </CardContent>
      </CardOnModal>
    </Modal>
  )
}

export default ShowImageModal
