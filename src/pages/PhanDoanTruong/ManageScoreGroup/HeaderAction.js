import React, { useState } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { Fab, Menu, Tooltip, List, ListItem, Collapse, ListItemText } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faFileUpload, faFileAlt, faDownload } from '@fortawesome/free-solid-svg-icons'

import config from 'config'
import sessionHelper from 'utils/sessionHelper'
import { SemesterSelected } from './recoil'
import { ChooseFileDialogAtom, DocumentPreviewDialogAtom } from 'components/Dialog/recoil'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { SemesterEnum } from 'app/enums'

export default function HeaderAction() {
  const semester = useRecoilValue(SemesterSelected)
  const [anchorEl, setAnchorEl] = useState(null)
  const [dialog, setDialog] = useRecoilState(ChooseFileDialogAtom)
  const [expand, setExpand] = useState(false)
  // const setReportDialog = useSetRecoilState(DocumentPreviewDialogAtom)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleExpand = () => {
    setExpand(!expand)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setExpand(false)
  }

  const handleDownloadExcel = (e, semesterCode) => {
    e.preventDefault()

    window.open(`${config.ApiEndpoint}/file/getGroupScoreCSV?ScholasticId=${sessionHelper().scholasticId}&UserId=${sessionHelper().userId}&Semester=${semesterCode}`, '_parent')
    handleClose()
  }

  const handleUploadExcel = () => {
    setDialog({ ...dialog, openChooseFileDialog: true, pageCall: 'PDT-StudentGroupScore', semesterId: semester })
    handleClose()
  }

  // const handleViewReport = () => {
  //   setReportDialog({ ...dialog, openPreviewDialog: true, templateType: TemplateType.Report })
  //   handleClose()
  // }

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
            <ListItem key="action-download-PDF" button onClick={handleExpand}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-left">
                    <FontAwesomeIcon icon={faFileExcel} size="lg" className="mr-3" />
                    <div className="d-flex align-items-center">Tải mẫu nhập điểm</div>
                    <div style={{ marginLeft: 'auto' }}>{expand ? <ExpandLess /> : <ExpandMore />}</div>
                  </div>
                </div>
              </div>
            </ListItem>
            <Collapse in={expand} timeout="auto" unmountOnExit>
              <List disablePadding>
                <ListItem button onClick={e => handleDownloadExcel(e, SemesterEnum.semesterOne)}>
                  <ListItemText primary="Học kỳ I" />
                </ListItem>
                <ListItem button onClick={e => handleDownloadExcel(e, SemesterEnum.semesterTwo)}>
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
            {/* <ListItem key="action-upload-excel" button onClick={handleViewReport}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-left">
                    <FontAwesomeIcon icon={faFileAlt} size="lg" className="mr-3" />
                    <div className="d-flex align-items-center">Xem báo cáo</div>
                  </div>
                </div>
              </div>
            </ListItem> */}
          </List>
        </div>
      </Menu>
    </>
  )
}
