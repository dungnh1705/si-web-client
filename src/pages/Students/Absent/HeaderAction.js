import React from 'react'
import { useRecoilState } from 'recoil'
import { Tooltip, Fab } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { Roles } from 'app/enums'
import sessionHelper from 'utils/sessionHelper'

import { OpenAbsentForm } from './recoil'

export default function HeaderAction() {
  const [openForm, setOpenForm] = useRecoilState(OpenAbsentForm)

  return (
    <Tooltip arrow title="Thêm mới ngày nghỉ">
      <Fab
        component="div"
        size="small"
        color="primary"
        disabled={sessionHelper().unionId === 1 && !sessionHelper().roles.includes(Roles.HocTap)}
        onClick={() => setOpenForm(!openForm)}>
        <FontAwesomeIcon icon={faPlus} />
      </Fab>
    </Tooltip>
  )
}
