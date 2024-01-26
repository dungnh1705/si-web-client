import React from 'react'
import { Collapse, Fab, List, ListItem, ListItemText, Menu, Tooltip } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faDownload } from '@fortawesome/free-solid-svg-icons'
import { useRecoilValue } from 'recoil'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import { doDownload } from 'utils/axios'
import { SemesterEnum } from 'app/enums'
import sessionHelper from 'utils/sessionHelper'
import { GroupSelected } from 'pages/BanQuanTri/GroupInfo/recoil'

export default function HeaderDownload() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [expandScore, setExpandScore] = React.useState(false)

  const classSelected = useRecoilValue(GroupSelected)

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
    setExpandScore(false)
  }

  function handleExpandScore() {
    setExpandScore(!expandScore)
  }

  async function handleDownloadStudentInfo(e) {
    e.preventDefault()
    handleClose()

    const params = {
      scholasticId: sessionHelper().scholasticId,
      classId: classSelected.id,
      userId: classSelected.leaderId,
      isFromManager: true
    }

    return doDownload('file/getGroupStudentInfoCSV', params)
  }

  async function handleDownloadGroupScore(e, semesterCode) {
    e.preventDefault()
    handleClose()

    const params = {
      scholasticId: sessionHelper().scholasticId,
      semesterCode,
      classId: classSelected.id,
      userId: classSelected.leaderId
    }

    return doDownload('download/groupResultExcelFile', params)
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
            <ListItem key="action-download-student-info" button onClick={handleDownloadStudentInfo}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-left">
                    <FontAwesomeIcon icon={faFileExcel} size="lg" className="mr-3" />
                    <div className="d-flex align-items-center">Tải danh sách thông tin Đoàn sinh</div>
                  </div>
                </div>
              </div>
            </ListItem>
            <ListItem key="action-download-PDF" button onClick={handleExpandScore}>
              <div className="grid-menu grid-menu-1col w-100">
                <div>
                  <div className="d-flex justify-content-left">
                    <FontAwesomeIcon icon={faFileExcel} size="lg" className="mr-3" />
                    <div className="d-flex align-items-center">Tải kết quả Học tập</div>
                    <div style={{ marginLeft: 'auto' }}>{expandScore ? <ExpandLess /> : <ExpandMore />}</div>
                  </div>
                </div>
              </div>
            </ListItem>
            <Collapse in={Boolean(expandScore)} timeout="auto" unmountOnExit style={{ width: '100%' }}>
              <List disablePadding>
                <ListItem button onClick={e => handleDownloadGroupScore(e, SemesterEnum.semesterOne)} style={{ textAlign: 'center' }}>
                  <ListItemText primary="Học kỳ I" />
                </ListItem>
                <ListItem button onClick={e => handleDownloadGroupScore(e, SemesterEnum.semesterTwo)} style={{ textAlign: 'center' }}>
                  <ListItemText primary="Học kỳ II" />
                </ListItem>
                <ListItem button onClick={e => handleDownloadGroupScore(e, SemesterEnum.total)} style={{ textAlign: 'center' }}>
                  <ListItemText primary="Cả năm" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </div>
      </Menu>
    </>
  )
}
