import React, { useState } from 'react'
import { List, ListItem, Tooltip, Fab, Menu } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faDownload } from '@fortawesome/free-solid-svg-icons'
import { useSetRecoilState } from 'recoil'

import sessionHelper from 'utils/sessionHelper'
import { doPost } from 'utils/axios'
import { toastState } from 'recoils/atoms'

const apiEndpoint = process.env.REACT_APP_WEB_API
const templateId = process.env.REACT_APP_START_YEAR_DOC_ID

export default function HeaderAction() {
  const [anchorEl, setAnchorEl] = useState(null)

  const setToast = useSetRecoilState(toastState)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDownload = async e => {
    e.preventDefault()
    handleClose()

    try {
      const data = {
        StudentId: [],
        ClassId: null,
        ScholasticId: sessionHelper().scholasticId,
        UserId: sessionHelper().userId,
        TemplateId: templateId,
        IsPreview: false
      }

      const res = await doPost(`download/previewForm`, data)
      if (res && res.data.success) {
        const { data } = res.data
        window.open(`${apiEndpoint}/file/get?fileName=${data}`, '_parent')
      }
    } catch (err) {
      setToast({ open: true, message: err.message, type: 'error' })
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip title="Tải xuống">
        <Fab component="div" size="small" color="primary" onClick={handleOpen}>
          <FontAwesomeIcon icon={faDownload} />
        </Fab>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        onClose={handleClose}>
        <div className="dropdown-menu-right dropdown-menu-lg overflow-hidden p-0">
          <List className="text-left bg-transparent d-flex align-items-center flex-column pt-0">
            <ListItem key="action-download-PDF" button onClick={handleDownload}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-left">
                    <FontAwesomeIcon icon={faFileExcel} size="lg" className="mr-3" />
                    <div className="d-flex align-items-center">Tải danh sách Đoàn sinh</div>
                  </div>
                </div>
              </div>
            </ListItem>
          </List>
        </div>
      </Menu>
    </>
  )
}
