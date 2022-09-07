import React from 'react'
import { useRecoilValue } from 'recoil'
import { CardContent, Modal, Grid, Divider, IconButton, Tooltip } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import CardOnModal from 'components/CardOnModal'

import noImage from 'assets/images/no_image.jpg'
import { UserAvatarQuery } from 'recoils/selectors'

const ShowImageModal = ({ open, handleClose }) => {
  const avatar = useRecoilValue(UserAvatarQuery)

  return (
    <Modal open={open} onClose={handleClose} className="uw-modal">
      <CardOnModal>
        <div className="card-header d-flex pb-1 pt-1">
          <Grid container item justifyContent="flex-end">
            <div className="card-header--actions">
              <Tooltip title="Đóng">
                <IconButton size="medium" onClick={handleClose}>
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
              <img src={avatar.previewUrl ?? noImage} alt="preview" width="100%" height="100%" />
            </Grid>
          </Grid>
        </CardContent>
      </CardOnModal>
    </Modal>
  )
}

export default ShowImageModal
