import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Fab, Tooltip } from '@material-ui/core'
import { useSetRecoilState } from 'recoil'

import { OpenEditorForm } from './recoil'

export default function HeaderAction() {
  const setEditorForm = useSetRecoilState(OpenEditorForm)

  const handleNewClick = e => {
    e.preventDefault()

    setEditorForm({ OpenEditor: true })
  }

  return (
    <Tooltip title="Tạo biểu mẫu mới">
      <Fab component="div" size="small" color="primary" onClick={handleNewClick}>
        <FontAwesomeIcon icon={faPlus} />
      </Fab>
    </Tooltip>
  )
}
