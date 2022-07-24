import React, { useState } from 'react'
import { Menu, Tooltip, List, ListItem, Collapse, ListItemText, Fab } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faFilePdf, faFileExcel, faFileUpload } from '@fortawesome/free-solid-svg-icons'

import { useRecoilValue, useRecoilState } from 'recoil'
import { StudentListQuery } from './recoil'

import config from 'config'
import sessionHelper from 'utils/sessionHelper'
import { ChooseFileDialogAtom, ScoreDownloadDialogAtom } from 'components/Dialog/recoil'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

export default function HeaderAction() {
  let [anchorEl, setAnchorEl] = useState(null)
  let lstStudent = useRecoilValue(StudentListQuery)
  let [scoreDownload, setScoreDownload] = useRecoilState(ScoreDownloadDialogAtom)
  let [dialog, setDialog] = useRecoilState(ChooseFileDialogAtom)
  const [open, setOpen] = useState(false)

  const handleExpand = () => {
    setOpen(!open)
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  const handleDownloadPDF = () => {
    setScoreDownload({ ...scoreDownload, openScoreDownload: true, lstStudent: lstStudent })
    handleClose()
  }

  const handleDownloadExcel = (e, semesterCode) => {
    e.preventDefault()

    window.open(
      `${config.ApiEndpoint}/file/getScoreCSV?ScholasticId=${sessionHelper().scholasticId}&ClassId=${sessionHelper().classId}&UnionId=${sessionHelper().unionId}&SemesterCode=${semesterCode}`,
      '_parent'
    )
    handleClose()
  }

  const handleUploadExcel = () => {
    setDialog({ ...dialog, openChooseFileDialog: true, pageCall: 'HT-StudentScore' })
    handleClose()
  }

  return (
    <>
      <Tooltip title="Tải xuống">
        <Fab component="div" size="small" color="primary" onClick={handleClick}>
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
            <ListItem key="action-download-Excel" button onClick={handleDownloadPDF}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-left">
                    <FontAwesomeIcon icon={faFilePdf} size="lg" className="mr-3" />
                    <div className="d-flex align-items-center">Tải phiếu báo điểm</div>
                  </div>
                </div>
              </div>
            </ListItem>
            <ListItem key="action-download-PDF" button onClick={handleExpand}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-left">
                    <FontAwesomeIcon icon={faFileExcel} size="lg" className="mr-3" />
                    <div className="d-flex align-items-center">Tải mẫu nhập điểm</div>
                    <div style={{ marginLeft: 'auto' }}>{open ? <ExpandLess /> : <ExpandMore />}</div>
                  </div>
                </div>
              </div>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List disablePadding>
                <ListItem button onClick={e => handleDownloadExcel(e, 1)}>
                  <ListItemText primary="Học kỳ I" />
                </ListItem>
                <ListItem button onClick={e => handleDownloadExcel(e, 2)}>
                  <ListItemText primary="Học kỳ II" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem key="action-upload-excel" button onClick={handleUploadExcel}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-left">
                    <FontAwesomeIcon icon={faFileUpload} size="lg" className="mr-3" />
                    <div className="d-flex align-items-center">Nhập điểm từ file</div>
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
