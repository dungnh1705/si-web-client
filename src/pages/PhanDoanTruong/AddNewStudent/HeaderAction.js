import React, { useState } from 'react'
import { List, ListItem, Tooltip, Fab, Menu } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faDownload } from '@fortawesome/free-solid-svg-icons'
import { useRecoilState } from 'recoil'

import { ChooseFileInfoDialogAtom } from 'components/Dialog/recoil'

const apiEndpoint = process.env.REACT_APP_WEB_API

export default function HeaderAction() {
  const [anchorEl, setAnchorEl] = useState(null)

  const [dialog, setDialog] = useRecoilState(ChooseFileInfoDialogAtom)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDownloadStudentInfo = async e => {
    e.preventDefault()

    window.open(`${apiEndpoint}/file/getRegisterFile`, '_parent')
    handleClose()
  }

  const handleUploadStudentInfoFile = () => {
    setDialog({ ...dialog, openChooseFileDialog: true, pageCall: 'PDT-AddStudentGroup' })
    handleClose()
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
            <ListItem key="action-download-PDF" button onClick={handleDownloadStudentInfo}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-left">
                    <FontAwesomeIcon icon={faFileExcel} size="lg" className="mr-3" />
                    <div className="d-flex align-items-center">Tải file nhập Đoàn sinh</div>
                  </div>
                </div>
              </div>
            </ListItem>

            <ListItem key="action-upload-PDF" button onClick={handleUploadStudentInfoFile}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-left">
                    <FontAwesomeIcon icon={faFileExcel} size="lg" className="mr-3" />
                    <div className="d-flex align-items-center">Thêm Đoàn sinh từ file</div>
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
