import React, { useState } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { Fab, Menu, Tooltip, List, ListItem, Collapse, ListItemText } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faFileUpload, faDownload, faFilePdf } from '@fortawesome/free-solid-svg-icons'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import { SemesterEnum } from 'app/enums'
import sessionHelper from 'utils/sessionHelper'

import { ChooseFileDialogAtom, GroupScoreResultDialogAtom } from 'components/Dialog/recoil'

import { SemesterSelected } from 'recoils/atoms'
import { doDownload } from 'utils/axios'

export default function HeaderAction() {
  const [expand, setExpand] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [expandDownloadDoc, setExpandDownloadDoc] = useState(false)

  const semester = useRecoilValue(SemesterSelected)

  const [dialog, setDialog] = useRecoilState(ChooseFileDialogAtom)
  const [dialogResult, setDialogResult] = useRecoilState(GroupScoreResultDialogAtom)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleExpand = () => {
    setExpand(!expand)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setExpand(false)
    setExpandDownloadDoc(false)
  }

  const handleDownloadExcel = async (e, semesterCode) => {
    e.preventDefault()
    handleClose()

    const params = {
      scholasticId: sessionHelper().scholasticId,
      classId: sessionHelper().classId,
      userId: sessionHelper().userId,
      semester: semesterCode,
      groupId: sessionHelper().groupId
    }

    await doDownload('file/getGroupScoreCSV', params)
  }

  const handleUploadExcel = () => {
    setDialog({ ...dialog, openChooseFileDialog: true, pageCall: 'PDT-StudentGroupScore', semesterId: semester })
    handleClose()
  }

  const handleDownloadResult = async (event, semesterCode) => {
    event.preventDefault()
    let templateId = '',
      title = ''

    if (semesterCode === SemesterEnum.semesterOne) {
      templateId = process.env.REACT_APP_FROM_RESULT_SEMESTER_ONE_ID
      title = 'HKI'
    }

    if (semesterCode === SemesterEnum.total) {
      templateId = process.env.REACT_APP_FROM_RESULT_TOTAL_ID
      title = 'Cả năm'
    }

    setDialogResult({ ...dialogResult, open: true, templateId: templateId, title: title })
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
            <ListItem key="action-download-Phieu-Diem" button onClick={() => setExpandDownloadDoc(!expandDownloadDoc)}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-left">
                    <FontAwesomeIcon icon={faFilePdf} size="lg" className="mr-3" />
                    <div className="d-flex align-items-center">Tải phiếu điểm</div>
                    <div style={{ marginLeft: 'auto' }}>{expandDownloadDoc ? <ExpandLess /> : <ExpandMore />}</div>
                  </div>
                </div>
              </div>
            </ListItem>
            <Collapse in={expandDownloadDoc} timeout="auto" unmountOnExit style={{ width: '100%' }}>
              <List disablePadding>
                <ListItem button onClick={e => handleDownloadResult(e, SemesterEnum.semesterOne)} style={{ textAlign: 'center' }}>
                  <ListItemText primary="Học kỳ I" />
                </ListItem>
                <ListItem button onClick={e => handleDownloadResult(e, SemesterEnum.total)} style={{ textAlign: 'center' }}>
                  <ListItemText primary="Cả năm" />
                </ListItem>
              </List>
            </Collapse>
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
            <Collapse in={expand} timeout="auto" unmountOnExit style={{ width: '100%' }}>
              <List disablePadding>
                <ListItem button onClick={e => handleDownloadExcel(e, SemesterEnum.semesterOne)} style={{ textAlign: 'center' }}>
                  <ListItemText primary="Học kỳ I" />
                </ListItem>
                <ListItem button onClick={e => handleDownloadExcel(e, SemesterEnum.semesterTwo)} style={{ textAlign: 'center' }}>
                  <ListItemText primary="Học kỳ II" />
                </ListItem>
                <ListItem button onClick={e => handleDownloadExcel(e, SemesterEnum.total)} style={{ textAlign: 'center' }}>
                  <ListItemText primary="Cả năm" />
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
